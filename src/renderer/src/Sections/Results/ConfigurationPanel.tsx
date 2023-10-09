import { useMain } from '@renderer/context/MainContext'

export default function ConfigurationPanel({ id }: { id: string }): JSX.Element {
  const { state } = useMain()
  const scan = state.scans[id]

  return (
    <div>
      {scan.deletedFiles.map((del) => (
        <div key={del.id}>{del.count}</div>
      ))}
    </div>
  )
}
