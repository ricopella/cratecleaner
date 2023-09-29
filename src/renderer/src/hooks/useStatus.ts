import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface UseStatus<T> {
  status: Status
  data: T | null
  message: string | null
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
  const [message, setMessage] = useState<string | null>(null)

  const idle = (): void => {
    setStatus('idle')
    setMessage(null)
    setData(null)
  }

  const loading = (): void => {
    setStatus('loading')
    setMessage(null)
    setData(null)
  }

  const handleResponse = (response: DatabaseOperationResult<T>): void => {
    if (response.success) {
      setStatus('success')
      setData(response.data)
      setMessage(null)
    } else {
      setStatus('error')
      setMessage(response.error)
      setData(null)
    }
  }

  const reset = (): void => {
    setStatus('idle')
    setMessage(null)
    setData(null)
  }

  return { status, data, message, idle, loading, handleResponse, reset }
}
