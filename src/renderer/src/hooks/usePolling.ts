import { useEffect, useRef } from 'react'

type PollingCallback<T> = () => Promise<T>
type DispatchCallback<T> = (data: T) => void

export const usePolling = <T>(
  callback: PollingCallback<T>,
  interval: number,
  dispatch: DispatchCallback<T>
): void => {
  const intervalId = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const pollData = async (): Promise<void> => {
      try {
        const result = await callback()
        dispatch(result)
      } catch (error) {
        // TODO: Handle errors from the polling callback.
        console.error(error)
      }
    }

    intervalId.current = setInterval(pollData, interval)

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current)
      }
    }
  }, [callback, interval])
}
