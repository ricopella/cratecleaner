import { GET_FILES_DIRECTORIES, NEW_FILES_DIRECTORY } from '@src/constants'
import { useEffect, useState } from 'react'

import { FilesDirectory } from '@prisma/client'
import { useMain } from '@renderer/actions/context'
import { getFilesDirectories, openFilesDirectoryDialog } from '@renderer/actions/ipc'
import { useFetchAndDispatch } from '@renderer/hooks/useFetchAndDispatch'
import { useIpcListener } from '@renderer/hooks/useIPCListener'
import { DatabaseOperationResult } from '@src/types'

export const useFetchDirectories = (): {
  fetchData: () => void
  status: string
  reset: () => void
  message: string | null
} => {
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

function DirectoriesList(): JSX.Element {
  const { state, dispatch } = useMain()
  const [error, setError] = useState<string | null>(null)

  const { status, reset, fetchData, message } = useFetchDirectories()
  useIpcListener(NEW_FILES_DIRECTORY, (res: DatabaseOperationResult<FilesDirectory>) => {
    if (res.success === false) {
      setError(res.error)
      return
    }

    dispatch({
      type: NEW_FILES_DIRECTORY,
      payload: {
        directorySrc: res.data
      }
    })
  })

  useEffect(() => {
    fetchData()
  }, [])

  const directories = state.directorySrcs

  const renderList = (): JSX.Element => {
    if (status === 'loading') {
      return <div>Loading...</div>
    }

    if (status === 'error' || error) {
      return (
        <div>
          {/* TODO: need to refactor as this try again calls wrong function */}
          <button onClick={reset}>Try again</button>
          <div>{message ?? error ?? ''}</div>
        </div>
      )
    }

    return (
      <div>
        {(directories || []).map((directory) => (
          <div key={directory.id}>{directory.path}</div>
        ))}
      </div>
    )
  }

  return (
    <div className="container">
      <button onClick={openFilesDirectoryDialog}>Set Directory Path</button>
      {renderList()}
    </div>
  )
}

export default DirectoriesList
