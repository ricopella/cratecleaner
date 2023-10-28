import ErrorMessage from '@renderer/components/ErrorMessage'
import useMain from '@renderer/context/hooks/useMain'
import useTableContext from '@renderer/context/hooks/useTableContext'
import { useMemo } from 'react'

const classNames = {
  row: 'grid grid-cols-max-max-1fr-max-max gap-2',
  btn: 'btn btn-sm',
  errorContainer: 'bg-base-200 p-2 rounded'
}
export default function ActionsRow(): JSX.Element {
  const { state } = useMain()
  const { rowSelection, setRowSelection } = useTableContext()

  const selectedCount = useMemo(() => {
    return Object.values(rowSelection).filter(Boolean).length
  }, [rowSelection])

  const showPrompt = (): void => {
    const element = document.getElementById('delete-confirm-modal') as HTMLDialogElement | null

    if (element) {
      element.showModal()
    }
  }

  return (
    <div className={classNames.row}>
      <button
        className={`${classNames.btn} btn-warning ${selectedCount > 0 ? '' : 'btn-disabled'}`}
        disabled={selectedCount > 0 ? false : true}
        onClick={showPrompt}
      >
        Delete {selectedCount}
      </button>
      <button
        className={`${classNames.btn} btn-neutral ${selectedCount > 0 ? '' : 'btn-disabled'}`}
        disabled={selectedCount > 0 ? false : true}
        onClick={(): void => setRowSelection({})}
      >
        Reset
      </button>
      <div className={classNames.errorContainer}>
        <ErrorMessage error={state.error} />
      </div>
      <div />
    </div>
  )
}
