import { GET_FILES_DIRECTORIES } from '@src/constants'
import { useEffect } from 'react'

import { useMain } from '@renderer/actions/context'
import {
  CallBack,
  getFilesDirectories,
  listenForSelectFilesDirectory,
  openFilesDirectoryDialog,
  removeSelectFilesDirectoryListener
} from '@renderer/actions/ipc'

const callback: CallBack = (path: string) => {
  console.log(`You selected: ${path}`)
}

export const useListenForSelectDirectory = (): void => {
  useEffect(() => {
    listenForSelectFilesDirectory(callback)

    return () => {
      removeSelectFilesDirectoryListener(callback)
    }
  }, [callback])
}

export const useFetchCrateSrcs = (): void => {
  const { state, dispatch } = useMain()
  const crates = state.crateSrcs

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      // TODO: add error handling and loading states
      const fileDirs = await getFilesDirectories()

      dispatch({
        type: GET_FILES_DIRECTORIES,
        payload: {
          directorySrcs: fileDirs.success ? fileDirs.data : []
        }
      })
    }

    if ((crates || []).length === 0) {
      fetchData()
    }
  }, [crates, dispatch])
}

function App(): JSX.Element {
  const { state } = useMain()

  useListenForSelectDirectory()
  useFetchCrateSrcs()

  const directories = state.directorySrcs

  return (
    <div className="container">
      <button onClick={openFilesDirectoryDialog}>Set Directory Path</button>
      {(directories || []).map((crate) => (
        <div className="text-2xl" key={crate.id}>
          {crate.path}
        </div>
      ))}
    </div>
  )
}

export default App
