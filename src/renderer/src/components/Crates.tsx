import { openCrateDialog, removeCrateSource } from '@renderer/actions/ipc'
import useCrateSources from '@renderer/hooks/useCrateSources'
import Loader from './Loader'

export default function Crates(): JSX.Element {
  const { status: crateStatus, crates, refetch } = useCrateSources()

  const renderContent = (): JSX.Element => {
    if (crateStatus === 'loading') {
      return (
        <div>
          <Loader />
        </div>
      )
    }

    if (crateStatus === 'error') {
      return <div>Error</div>
    }

    if (crates?.length === 0) {
      return <div>No crates found. Your default Music/_serato_ folder will be used</div>
    }

    const handleDelete = async (id: string): Promise<void> => {
      await removeCrateSource(id)
      await refetch()
    }

    return (
      <div className="grid gap-4 border-2 border-base-300 rounded p-4">
        {crates?.map((crate) => (
          <div key={crate.id} className="grid grid-cols-1fr-max w-full">
            <span>{crate.path}</span>
            <button
              className="btn btn-xs btn-warning"
              onClick={(): Promise<void> => handleDelete(crate.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div tabIndex={0} className="collapse bg-base-200">
      <input type="checkbox" />
      <h1 className="collapse-title text-md">Crate File Locations</h1>
      <div className="collapse-content">
        {renderContent()}
        <div className="mt-4">
          <button
            className="btn btn-primary btn-outlined btn-xs"
            onClick={(): void => openCrateDialog()}
          >
            + Add Crate
          </button>
        </div>
      </div>
    </div>
  )
}
