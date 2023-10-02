import { FilesDirectory } from '@prisma/client'
import { getFilesDirectories } from '@renderer/actions/ipc'
import { useMain } from '@renderer/context/MainContext'
import { useTableContext } from '@renderer/context/TableContext'
import { GET_FILES_DIRECTORIES } from '@src/constants'
import { useEffect } from 'react'
import { useFetchAndDispatch } from './useFetchAndDispatch'

export default function useFetchDirectories(): {
  fetchData: () => void
  status: string
  reset: () => void
} {
  const { dispatch } = useMain()
  const { error, setError } = useTableContext()
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

  useEffect(() => {
    if (status === 'error' && message && error !== message) {
      setError(message)
    }
  }, [message, status])

  return { fetchData, status, reset }
}
