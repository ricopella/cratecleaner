import { FilesDirectory } from '@prisma/client'
import { MainContextProps } from '@renderer/actions/types'
import useDeletedFilesTracking from '@renderer/hooks/useDeletedFilesTracking'
import { useIpcListener } from '@renderer/hooks/useIPCListener'
import useScanTracking from '@renderer/hooks/useScanTracking'
import { NEW_FILES_DIRECTORY } from '@src/constants'
import { DatabaseOperationResult } from '@src/types'
import React, { ReactNode, createContext, useReducer } from 'react'
import { directoryReducer, initialState } from '../actions/reducer'

export const MainContext = createContext<MainContextProps | null>(null)

interface MainProviderProps {
  children: ReactNode
}

export const MainProvider: React.FC<MainProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(directoryReducer, initialState)
  useIpcListener(NEW_FILES_DIRECTORY, (res: DatabaseOperationResult<FilesDirectory>) => {
    if (res.success === false) {
      dispatch({
        type: 'SET_ERROR_MESSAGE',
        payload: {
          error: res.error
        }
      })
      return
    }

    dispatch({
      type: NEW_FILES_DIRECTORY,
      payload: {
        directorySrc: res.data
      }
    })
  })

  useDeletedFilesTracking({ state, dispatch })
  useScanTracking({ state, dispatch })

  return <MainContext.Provider value={{ state, dispatch }}>{children}</MainContext.Provider>
}
