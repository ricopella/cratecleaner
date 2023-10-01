import { getDuplicates } from '@renderer/actions/ipc'
import { useMain } from '@renderer/context/MainContext'

export const useFetchCrateSrcs = (): void => {
  const { state, dispatch } = useMain()
  const crates = state.crateSrcs
}

function Duplicates(): JSX.Element {
  const fetchData = async (): Promise<void> => {
    // TODO: add error handling and loading states
    const duplicates = await getDuplicates()
    console.log({ duplicates })
  }

  return (
    <div className="container">
      <button onClick={fetchData}>Get Duplicates</button>
    </div>
  )
}

export default Duplicates
