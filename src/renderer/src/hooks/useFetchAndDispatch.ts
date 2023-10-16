import { useMain } from '@renderer/context/MainContext'
import { useCallback } from 'react'
import useStatus, { DatabaseOperationResult } from './useStatus'

type FetchFunction<T> = () => Promise<DatabaseOperationResult<T>>
type DispatchFunction<T> = (data: T) => void

export const useFetchAndDispatch = <T>(
  fetchFn: FetchFunction<T>,
  dispatchFn: DispatchFunction<T>
): {
  fetchData: () => Promise<void>
  status: string
  reset: () => void
} => {
  const { status, loading, handleResponse, reset } = useStatus<T>()
  const { dispatch } = useMain()

  const fetchData = useCallback(async (): Promise<void> => {
    loading()
    try {
      const result = await fetchFn()
      handleResponse(result)
      if (result.success) {
        dispatchFn(result.data)
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR_MESSAGE',
        payload: {
          error: (error as { message: string }).message
        }
      })
      handleResponse({ success: false, error: (error as { message: string }).message })
    }
  }, [fetchFn, dispatchFn, loading, handleResponse])

  return { fetchData, status, reset }
}
