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
  message: string | null
} => {
  const { status, loading, handleResponse, reset, message } = useStatus<T>()

  const fetchData = useCallback(async (): Promise<void> => {
    loading()
    try {
      const result = await fetchFn()
      handleResponse(result)
      if (result.success) {
        dispatchFn(result.data)
      }
    } catch (error) {
      handleResponse({ success: false, error: (error as { message: string }).message })
    }
  }, [fetchFn, dispatchFn, loading, handleResponse])

  return { fetchData, status, reset, message }
}
