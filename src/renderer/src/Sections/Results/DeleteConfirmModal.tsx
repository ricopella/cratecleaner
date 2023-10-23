import { deleteFiles } from '@renderer/actions/ipc'
import { useMain } from '@renderer/context/MainContext'
import { ADD_TRACKING_DELETE_ID } from '@src/constants'
import { DuplicateData, NotCratedData, ResultsData } from '@src/types'
import { memo } from 'react'
import { v4 } from 'uuid'

type Props = {
  id: string // scan id
  data: ResultsData[]
  reset: () => void
  selectedCount: number
  selected: Record<string, boolean>
}

export default memo(function deleteWarningModal({
  data,
  id,
  selected,
  selectedCount,
  reset
}: Props): JSX.Element {
  const { dispatch, state } = useMain()
  const scan = state.scans[id]
  const onDelete = async (): Promise<void> => {
    const filesToDelete = Object.keys(selected).map((key) => {
      if (scan?.configuration?.scanType === 'duplicate') {
        const [rowId, fileIndex] = key.split('.')

        return (data[Number(rowId)] as DuplicateData).files[Number(fileIndex)].path
      } else {
        return (data[Number(key)] as NotCratedData).path
      }
    })

    // generate new uuid
    const deleteId = v4()

    // add to tracking to state so it can pool for results
    dispatch({
      type: ADD_TRACKING_DELETE_ID,
      payload: {
        deleteId: deleteId,
        scanId: id
      }
    })

    await deleteFiles(filesToDelete, id, deleteId)

    reset()

    // close modal
    const modal = document.getElementById('delete-confirm-modal') as HTMLDialogElement

    if (modal) {
      modal.close()
    }
  }

  return (
    <dialog id="delete-confirm-modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete files</h3>
        <p className="py-4 text-warning">
          Are you sure you want to delete {selectedCount} file(s). This can not be un-dune or
          restored. The files will be permanently removed.
        </p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div>
            <button className="btn btn-warning btn-sm" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
})
