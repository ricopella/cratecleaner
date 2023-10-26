import { getDeletedFilesCount } from '@renderer/actions/ipc'
import { Status } from '@src/types'
import { useQuery } from '@tanstack/react-query'

const useDeletedFilesCount = (): {
  status: Status
  count: number | null
} => {
  const { data: res, status } = useQuery({
    queryKey: ['deletedFilesCount'],
    queryFn: getDeletedFilesCount
  })

  const { data } = res?.success ? res : { data: null }

  return {
    count: data,
    status
  }
}

export default useDeletedFilesCount
