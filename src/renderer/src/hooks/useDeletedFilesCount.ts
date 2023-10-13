import { getDeletedFilesCount } from '@renderer/actions/ipc'
import { Status } from '@src/types'
import { useEffect } from 'react'
import useStatus from './useStatus'

const useDeletedFilesCount = (): {
  status: Status
  count: number | null
} => {
  const { status, loading, handleResponse, data } = useStatus<number>()

  const fetchData = async (): Promise<void> => {
    loading()

    const response = await getDeletedFilesCount()

    handleResponse(response)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    count: data,
    status
  }
}

export default useDeletedFilesCount
