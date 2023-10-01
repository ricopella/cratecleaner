import { useMain } from '@renderer/context/MainContext'

export default function Results({ id }: { id: string }): JSX.Element {
  const { state } = useMain()

  const scan = state.scans[id]
  return (
    <div>
      Results {id} {scan.status}
    </div>
  )
}
