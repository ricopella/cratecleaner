import { FilesDirectory } from '@prisma/client'
import { useMain } from '@renderer/actions/context'
import { getFilesDirectories } from '@renderer/actions/ipc'
import { GET_FILES_DIRECTORIES } from '@src/constants'
import { useFetchAndDispatch } from './useFetchAndDispatch'

export default function useFetchDirectories(): {
  fetchData: () => void
  status: string
  reset: () => void
  message: string | null
} {
  const { dispatch } = useMain()

  const fetchFn = getFilesDirectories
  const dispatchFn = (data: FilesDirectory[]): void => {
    dispatch({
      type: GET_FILES_DIRECTORIES,
      payload: {
        directorySrcs: data
      }
    })
  }

  const { fetchData, status, reset, message } = useFetchAndDispatch(fetchFn, dispatchFn)

  return { fetchData, status, reset, message }
}
