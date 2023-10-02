import { GET_CRATE_SRCS } from '@src/constants'
import { useEffect } from 'react'

import {
  CallBack,
  getCrateSrcs,
  listenForSelectDirectory,
  openCrateDialog,
  removeSelectDirectoryListener
} from '@renderer/actions/ipc'
import { useMain } from '@renderer/context/MainContext'

const callback: CallBack = (path: string) => {
  console.log(`You selected: ${path}`)
}

export const useListenForSelectDirectory = (): void => {
  useEffect(() => {
    // TODO: this will need to dispatch state changes
    listenForSelectDirectory(callback)

    return () => {
      removeSelectDirectoryListener(callback)
    }
  }, [callback])
}

export const useFetchCrateSrcs = (): void => {
  const { state, dispatch } = useMain()
  const crates = state.crateSrcs

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      // TODO: add error handling and loading states
      const crates = await getCrateSrcs()

      dispatch({
        type: GET_CRATE_SRCS,
        payload: {
          crateSrcs: crates.success ? crates.data : []
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

  const crates = state.crateSrcs

  return (
    <div className="container">
      <button className="btn btn-primary" onClick={openCrateDialog}>
        Set Crate Path
      </button>
      {(crates || []).map((crate) => (
        <div className="text-2xl" key={crate.id}>
          {crate.path}
        </div>
      ))}
    </div>
  )
}

export default App
