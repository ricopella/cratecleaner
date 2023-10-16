import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface UseStatus<T> {
  status: Status
  data: T | null
  idle: () => void
  loading: () => void
  handleResponse: (response: DatabaseOperationResult<T>) => void
  reset: () => void
}

export type DatabaseOperationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export default function useStatus<T = unknown>(): UseStatus<T> {
  const [status, setStatus] = useState<Status>('idle')
  const [data, setData] = useState<T | null>(null)

  const idle = (): void => {
    setStatus('idle')
    setData(null)
  }

  const loading = (): void => {
    setStatus('loading')
    setData(null)
  }

  const handleResponse = (response: DatabaseOperationResult<T>): void => {
    if (response.success) {
      setStatus('success')
      setData(response.data)
    } else {
      setStatus('error')
      setData(null)
    }
  }

  const reset = (): void => {
    setStatus('idle')
    setData(null)
  }

  return { status, data, idle, loading, handleResponse, reset }
}
