import { fetchScanStatusById } from '@renderer/actions/ipc'
import { useMain } from '@renderer/context/MainContext'
import { transformScan } from '@renderer/utils/transformScan'
import { UPDATE_SCAN_STATUS } from '@src/constants'
import { useEffect } from 'react'

const useScanTracking = ({
  state,
  dispatch
}: {
  state: ReturnType<typeof useMain>['state']
  dispatch: ReturnType<typeof useMain>['dispatch']
}): void => {
  useEffect(() => {
    const intervalIds: NodeJS.Timeout[] = []
    const pollingDuration = 3 * 60 * 1000 // timeout at 3 min

    Object.keys(state.scans).forEach((id) => {
      const scan = state.scans[id]

      const handleScan = async (): Promise<void> => {
        if (scan.status === 'pending') {
          let elapsed = 0 // Initialize elapsed time
          let interval = 2000 // Start with a 2-second interval

          const pollFunction = async (): Promise<void> => {
            elapsed += interval // Update elapsed time

            // Adjust interval based on elapsed time
            if (elapsed >= 1 * 60 * 1000 && elapsed < 2 * 60 * 1000) {
              interval = 5000 // Change to 5 seconds after 1 minute
            } else if (elapsed >= 2 * 60 * 1000 && elapsed < 3 * 60 * 1000) {
              interval = 20000 // Change to 20 seconds after 2 minutes
            } else if (elapsed >= 3 * 60 * 1000) {
              interval = 30000 // Change to 30 seconds after 3 minutes
            }

            // Fetch the latest status from your backend
            const scanRes = await fetchScanStatusById(id)

            if (scanRes.success === false) {
              clearInterval(intervalId)
              dispatch({
                type: 'SET_ERROR_MESSAGE',
                payload: {
                  error: scanRes.error
                }
              })
              return
            }

            if (scanRes.data.status !== 'pending') {
              clearInterval(intervalId)

              const scan = transformScan(scanRes.data)

              dispatch({
                type: UPDATE_SCAN_STATUS,
                payload: scan
              })

              if ((scan.results?.errors || []).length > 0) {
                dispatch({
                  type: 'SET_ERROR_MESSAGE',
                  payload: {
                    error: scan?.results?.errors?.join(', ') ?? ''
                  }
                })
              }
            }

            // Update the interval
            clearInterval(intervalId)
            intervalIds.splice(intervalIds.indexOf(intervalId), 1) // Remove old intervalId
            intervalId = setInterval(pollFunction, interval) // Update intervalId with new interval
            intervalIds.push(intervalId) // Store new intervalId
          }

          let intervalId = setInterval(pollFunction, interval) // Initial setInterval
          intervalIds.push(intervalId) // Store initial intervalId
        }

        if (scan.status === 'ready') {
          const scanRes = await fetchScanStatusById(id)

          if (scanRes.success === false) {
            dispatch({
              type: 'SET_ERROR_MESSAGE',
              payload: {
                error: scanRes.error
              }
            })
            return
          }

          const scan = transformScan(scanRes.data)

          dispatch({
            type: UPDATE_SCAN_STATUS,
            payload: scan
          })
        }
      }

      handleScan()
    })

    const timeoutId = setTimeout(() => {
      intervalIds.forEach((id) => clearInterval(id))
    }, pollingDuration)

    return () => {
      clearTimeout(timeoutId)
      intervalIds.forEach((id) => clearInterval(id))
    }
  }, [state.scans])
}

export default useScanTracking
