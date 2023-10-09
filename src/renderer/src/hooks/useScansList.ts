import { getScansList } from '@renderer/actions/ipc'
import { useMain } from '@renderer/context/MainContext'
import { useEffect } from 'react'

export default function useScansList(): void {
  const { dispatch } = useMain()

  useEffect(() => {
    getScansList().then((result) => {
      if (result.success) {
        dispatch({
          type: 'SET_SCANS_LIST',
          payload: {
            scans: result.data
          }
        })
      } else {
        dispatch({
          type: 'SET_ERROR_MESSAGE',
          payload: {
            error: result.error
          }
        })
      }
    })
  }, [])
}
