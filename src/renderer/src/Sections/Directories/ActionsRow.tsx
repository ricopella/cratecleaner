import { insertScan, openFilesDirectoryDialog, removeDirectories } from '@renderer/actions/ipc'
import ErrorMessage from '@renderer/components/ErrorMessage'
import PreviousResults from '@renderer/components/PreviousResults'
import useMain from '@renderer/context/hooks/useMain'
import useTableContext from '@renderer/context/hooks/useTableContext'
import { transformScan } from '@renderer/utils/transformScan'
import { ADD_NEW_SCAN, REMOVE_DIRECTORIES, UPDATE_ACTIVE_TAB } from '@src/constants'
import { useQueryClient } from '@tanstack/react-query'
import { isEmpty, keys } from 'ramda'

const classNames = {
  row: 'grid grid-cols-max-max-1fr-max-max gap-2',
  btn: 'btn btn-sm',
  errorContainer: 'bg-base-200 p-2 rounded'
}

export default function ActionsRow(): JSX.Element {
  const { state, dispatch } = useMain()
  const { rowSelection, setRowSelection } = useTableContext()
  const queryClient = useQueryClient()

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
      dispatch({
        type: 'SET_ERROR_MESSAGE',
        payload: {
          error: res.error
        }
      })
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

  const handleNewScan = async (): Promise<void> => {
    const res = await insertScan({
      directoryPaths: state.directorySrcs.map((directory) => directory.path),
      includeCrates: state.scanConfiguration.includeCrates,
      matchType: state.scanConfiguration.matchType,
      type: state.scanConfiguration.type,
      scanType: state.scanConfiguration.scanType
    })
    if (res.success === false) {
      dispatch({
        type: 'SET_ERROR_MESSAGE',
        payload: {
          error: res.error
        }
      })
      return
    }
    // causing an error log bc the insert is not in right shape
    const scan = transformScan(res.data)
    // add scan ID to main state
    dispatch({
      type: ADD_NEW_SCAN,
      payload: {
        id: res.data.id,
        scan
      }
    })

    queryClient.invalidateQueries({
      queryKey: ['scansList']
    })

    dispatch({
      type: UPDATE_ACTIVE_TAB,
      payload: {
        activeTab: res.data.id
      }
    })
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
        <ErrorMessage error={state.error} />
      </div>
      <PreviousResults />
      <button
        className={`${classNames.btn} ${state.directorySrcs.length === 0 ? 'btn-disabled' : ''}`}
        onClick={handleNewScan}
      >
        Scan
      </button>
    </div>
  )
}
