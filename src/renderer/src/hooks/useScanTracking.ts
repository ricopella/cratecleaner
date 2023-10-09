import { fetchScanStatusById } from '@renderer/actions/ipc'
import { useMain } from '@renderer/context/MainContext'
import { transformScan } from '@renderer/utils/transformScan'
import { UPDATE_SCAN_STATUS } from '@src/constants'
import { useEffect } from 'react'

/**
 * This hook is used to track the status of a scan.
 * It will poll the backend every 2 seconds to check if the status has changed.
 * If the status has changed, it will update the state.
 * If the status is still pending after 3 minutes, it will stop polling.
 *
 * If a new id is added to scans state, this hook will start tracking it.
 */
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

      // TODO: fix this - will not work when referencing older scans
      // const currentTime = new Date().getTime()
      // const createdAtTime = new Date(scan.createdAt).getTime()
      // const timeDifference = (currentTime - createdAtTime) / (1000 * 60)

      if (scan.status === 'pending') {
        const intervalId = setInterval(async () => {
          // Fetch the latest status from your backend
          const scanRes = await fetchScanStatusById(id)
          console.log({ scanRes })
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
}

export default useScanTracking
