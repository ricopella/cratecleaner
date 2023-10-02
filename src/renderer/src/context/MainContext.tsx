import { fetchScanStatusById } from '@renderer/actions/ipc'
import { transformScan } from '@renderer/utils/transformScan'
import { UPDATE_SCAN_STATUS } from '@src/constants'
import { MainContextProps } from '@src/types'
import React, { ReactNode, createContext, useContext, useEffect, useReducer } from 'react'
import { directoryReducer, initialState } from '../actions/reducer'

const MainContext = createContext<MainContextProps | null>(null)

interface MainProviderProps {
  children: ReactNode
}

export const MainProvider: React.FC<MainProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(directoryReducer, initialState)

  useEffect(() => {
    const intervalIds: NodeJS.Timeout[] = []

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

            dispatch({
              type: UPDATE_SCAN_STATUS,
              payload: scan
            })
          }
        }, 2000) // Poll every 2 seconds

        intervalIds.push(intervalId)
      }
    })

    return () => {
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
