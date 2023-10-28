import { FilesDirectory } from '@prisma/client'
import { getFilesDirectories } from '@renderer/actions/ipc'
import useMain from '@renderer/context/hooks/useMain'
import { GET_FILES_DIRECTORIES } from '@src/constants'
import { DatabaseOperationResult } from '@src/types'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export default function useFetchDirectories(): {
  fetchData: () => void
  status: string
} {
  const { dispatch } = useMain()

  const { status, refetch, data } = useQuery<DatabaseOperationResult<FilesDirectory[]>>({
    queryKey: ['filesDirectories'],
    queryFn: getFilesDirectories
  })

  useEffect(() => {
    if (data?.success) {
      dispatch({
        type: GET_FILES_DIRECTORIES,
        payload: {
          directorySrcs: data.data
        }
      })
    }

    if (!data?.success && data?.error) {
      dispatch({
        type: 'SET_ERROR_MESSAGE',
        payload: {
          error: data.error
        }
      })
    }
  }, [data, dispatch])

  return { fetchData: refetch, status }
}
