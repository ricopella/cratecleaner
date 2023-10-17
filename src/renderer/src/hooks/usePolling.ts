import { SET_ERROR_MESSAGE } from '@src/constants'
import { useEffect, useRef } from 'react'

type PollingCallback<T> = () => Promise<T>
type DispatchCallback<T> = (data: T) => void

export const usePolling = <T>(
  callback: PollingCallback<T>,
  interval: number,
  dispatch: DispatchCallback<T | { type: typeof SET_ERROR_MESSAGE; payload: { error: string } }>
): void => {
  const intervalId = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const pollData = async (): Promise<void> => {
      try {
        const result = await callback()
        dispatch(result)
      } catch (error) {
        console.error(error)

        const { message } = error as Error
        dispatch({
          type: SET_ERROR_MESSAGE,
          payload: { error: message }
        })

        if (intervalId.current) {
          clearInterval(intervalId.current)
        }
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
