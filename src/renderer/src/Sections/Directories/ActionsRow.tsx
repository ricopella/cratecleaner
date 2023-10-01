import { openFilesDirectoryDialog, removeDirectories } from '@renderer/actions/ipc'
import { useMain } from '@renderer/context/MainContext'
import { useTableContext } from '@renderer/context/TableContext'
import { REMOVE_DIRECTORIES } from '@src/constants'
import { isEmpty, keys } from 'ramda'

const classNames = {
  row: 'grid grid-cols-max-max-1fr gap-2',
  btn: 'btn btn-sm',
  errorContainer: 'bg-base-200 p-2 rounded',
  errorText: 'text-sm text-error'
}

export default function ActionsRow(): JSX.Element {
  const { state, dispatch } = useMain()
  const { error, rowSelection, setError, setRowSelection } = useTableContext()

  const handleRemoveDirectories = async (): Promise<void> => {
    const rowsToDelete = keys(rowSelection)
    const deleteKeys: string[] = state.directorySrcs.reduce((prev: string[], directory, i) => {
      if (rowsToDelete.includes(i.toString())) {
        prev.push(directory.id)
      }
      return prev
    }, [])

    const res = await removeDirectories(deleteKeys)

    if (res.success === false) {
      setError(res.error)
      return
    }

    dispatch({
      type: REMOVE_DIRECTORIES,
      payload: {
        ids: deleteKeys
      }
    })

    setRowSelection({})
  }

  return (
    <div className={classNames.row}>
      <button onClick={openFilesDirectoryDialog} className={classNames.btn}>
        +
      </button>
      <button
        disabled={isEmpty(rowSelection)}
        className={`${classNames.btn} ${isEmpty(rowSelection) ? 'btn-disabled' : ''}`}
        onClick={handleRemoveDirectories}
      >
        -
      </button>
      <div className={classNames.errorContainer}>
        {error && <div className={classNames.errorText}>{error}</div>}
      </div>
    </div>
  )
}
