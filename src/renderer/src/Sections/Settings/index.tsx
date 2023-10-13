import Crates from '@renderer/components/Crates'
import useDeletedFilesCount from '@renderer/hooks/useDeletedFilesCount'

export default function Settings(): JSX.Element {
  const { status, count } = useDeletedFilesCount()
  return (
    <div className="grid grid-rows-1fr-max h-full w-full">
      <div className="grid gap-6 grid-rows-max-max">
        <div>
          Total deleted files:{' '}
          {status === 'loading' ? 'Loading' : status === 'error' ? 'Error Retrieving' : count}
        </div>
        <Crates />
      </div>
      <div className="grid  justify-center">
        <aside className="text-xs text-neutral-content">
          &copy; {new Date().getFullYear()}, <span>Polyhedron Projects LLC.</span>
        </aside>
      </div>
    </div>
  )
}
