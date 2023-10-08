import { DeletedFiles, FilesDirectory } from '@prisma/client'
import { fetchScanStatusById, getDeletedFilesById } from '@renderer/actions/ipc'
import { MainContextProps } from '@renderer/actions/types'
import { useIpcListener } from '@renderer/hooks/useIPCListener'
import { transformDeletedFiles } from '@renderer/utils/transformDeletedFiles'
import { transformScan } from '@renderer/utils/transformScan'
import { ADD_DELETED_FILES_RESULT, NEW_FILES_DIRECTORY, UPDATE_SCAN_STATUS } from '@src/constants'
import { DatabaseOperationResult, ExtendedScan } from '@src/types'
import { prop } from 'ramda'
import React, { ReactNode, createContext, useContext, useEffect, useReducer } from 'react'
import { directoryReducer, initialState } from '../actions/reducer'

const MainContext = createContext<MainContextProps | null>(null)

interface MainProviderProps {
  children: ReactNode
}

export const MainProvider: React.FC<MainProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(directoryReducer, initialState)
  useIpcListener(NEW_FILES_DIRECTORY, (res: DatabaseOperationResult<FilesDirectory>) => {
    if (res.success === false) {
      //  TODO:move error to this state
      // setError(res.error)

      return
    }

    dispatch({
      type: NEW_FILES_DIRECTORY,
      payload: {
        directorySrc: res.data
      }
    })
  })

  useEffect(() => {
    const intervalIds: NodeJS.Timeout[] = []

    Object.keys(state.scans).forEach((id) => {
      const scan = state.scans[id]
      const { trackingDeleteId } = scan
      const deletedFiles =
        (scan as ExtendedScan & { deletedFiles: DeletedFiles[] })?.deletedFiles ?? []
      const deletedFilesIds = deletedFiles.map(prop('id'))

      if (trackingDeleteId && !deletedFilesIds.includes(trackingDeleteId)) {
        const intervalId = setInterval(async () => {
          const deleteRes = await getDeletedFilesById(trackingDeleteId)

          if (deleteRes.success === false) {
            clearInterval(intervalId)
          }

          if (deleteRes.success && deleteRes.data) {
            clearInterval(intervalId)

            dispatch({
              type: ADD_DELETED_FILES_RESULT,
              payload: {
                scanId: id,
                deletedFiles: transformDeletedFiles(deleteRes.data)
              }
            })
          }
        })

        intervalIds.push(intervalId)
      }
    })
  })

  useEffect(() => {
    const intervalIds: NodeJS.Timeout[] = []
    const pollingDuration = 3 * 60 * 1000

    Object.keys(state.scans).forEach((id) => {
      const scan = state.scans[id]

      // TODO: fix this - will not work when referencing older scans
      // const currentTime = new Date().getTime()
      // const createdAtTime = new Date(scan.createdAt).getTime()
      // const timeDifference = (currentTime - createdAtTime) / (1000 * 60)

      // do not poll if scan is not pending or if it's been more than 5 minutes
      if (scan.status === 'pending') {
        const intervalId = setInterval(async () => {
          // Fetch the latest status from your backend
          const scanRes = await fetchScanStatusById(id)
          console.log({ scanRes })
          if (scanRes.success === false) {
            clearInterval(intervalId)
            // TODO: handle error
            return
          }

          if (scanRes.data.status !== 'pending') {
            clearInterval(intervalId)

            const scan = transformScan(scanRes.data)
            console.log({ scan, scanRes })

            dispatch({
              type: UPDATE_SCAN_STATUS,
              payload: scan
            })
          }
        }, 2000) // Poll every 2 seconds

        intervalIds.push(intervalId)
      }
    })

    const timeoutId = setTimeout(() => {
      intervalIds.forEach((id) => clearInterval(id))
    }, pollingDuration)

    return () => {
      clearTimeout(timeoutId)

      intervalIds.forEach((id) => clearInterval(id))
    }
  }, [state.scans])

  return <MainContext.Provider value={{ state, dispatch }}>{children}</MainContext.Provider>
}

// Custom hook to use the directory state and dispatch
export const useMain = (): MainContextProps => {
  const context = useContext(MainContext)
  if (!context) {
    throw new Error('useDirectory must be used within a DirectoryProvider')
  }
  return context
}
