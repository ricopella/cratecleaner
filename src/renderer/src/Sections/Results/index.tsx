// import { trashFileList } from '@renderer/actions/ipc'
import Loader from '@renderer/components/Loader'
import IndeterminateCheckbox from '@renderer/components/Table/InderminateCheckbox'
import { useMain } from '@renderer/context/MainContext'
import { ResultsData, ScanResults } from '@src/types'
import {
  ExpandedState,
  createColumnHelper,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import ArrowRight from '../../assets/arrow-right.svg?react'
import TableBody from './TableBody'
import TableHeader from './TableHeader'
import { transformScanResultsToRows } from './utils'

const classNames = {
  container: 'h-full w-full grid grid-rows-max-1fr-max gap-2',
  table: 'table table-xs',
  tableContainer: 'h-full w-full overflow-y-scroll'
}

const columnHelper = createColumnHelper<ResultsData>()

const columns = [
  columnHelper.accessor('id', {
    id: 'id',
    enableGrouping: true,
    size: 24,
    header: undefined,
    cell: ({ row }) => (
      <div
        style={{
          paddingLeft: `${row.depth * 2}rem`
        }}
      >
        <>
          {row.depth === 0 ? (
            <>
              {row.getCanExpand() ? (
                <button
                  className="btn btn-ghost btn-xs rounded-btn"
                  {...{
                    onClick: row.getToggleExpandedHandler()
                  }}
                >
                  {row.getIsExpanded() ? (
                    <ArrowRight className="w-2 h-2 text-accent-content fill-current transform rotate-90" />
                  ) : (
                    <ArrowRight className="w-2 h-2 text-accent-content fill-current" />
                  )}
                </button>
              ) : null}
            </>
          ) : (
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler()
              }}
            />
          )}
        </>
      </div>
    )
  }),
  columnHelper.accessor('name', {
    cell: (info) => info.getValue(),
    enableGrouping: false
  }),

  columnHelper.accessor('path', {
    cell: (info) => info.getValue(),
    enableGrouping: false
  }),
  columnHelper.accessor('type', {
    cell: (info) => info.getValue(),
    enableGrouping: false,
    size: 32
  }),
  columnHelper.display({
    id: 'duplicateCount',
    size: 24,
    header: () => <span>Dupe Count</span>,
    cell: ({ row }) => row.original.files.length,
    enableGrouping: false
  })
]
export default function Results({ id }: { id: string }): JSX.Element {
  const { state } = useMain()
  const scan = state.scans[id]
  const results: ScanResults = scan.results ?? { files: {} }
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const data: ResultsData[] = useMemo(() => {
    return transformScanResultsToRows(results)
  }, [results])

  // Create an instance of the table
  const table = useReactTable<ResultsData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setSelected,
    getSubRows: (row) => {
      return row.files.map((file, fileIndex) => ({
        id: `${row.id}-${fileIndex}`, // Generate a unique ID for the sub-row
        name: file.name,
        path: file.path,
        files: []
      }))
    },
    state: {
      expanded,
      rowSelection: selected
    },
    debugTable: true,
    columnResizeMode: 'onChange'
  })

  console.log({ selected })

  const selectedCount = useMemo(() => {
    return Object.values(selected).filter(Boolean).length
  }, [selected])

  const onShowPrompt = (): void => {
    const element = document.getElementById('modal') as HTMLDialogElement | null

    if (element) {
      element.showModal()
    }
  }

  const onDelete = async (): Promise<void> => {
    // delete files
    // get a list of all the file paths to delete and send to main process
    const filesToDelete = Object.keys(selected).map((key) => {
      const [rowId, fileIndex] = key.split('.')
      return data[Number(rowId)].files[Number(fileIndex)].path
    })

    // update state
    // await trashFileList(filesToDelete)

    // TODO: figure out what to do with results since now that data set is stale

    // TODO: show success alert
    setSelected({})
  }

  return (
    <>
      <div className={classNames.container}>
        <div></div>
        <div className={classNames.tableContainer}>
          {scan.status === 'pending' ? (
            <div className="h-full w-full flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <table className={classNames.table}>
              <TableHeader table={table} />
              <TableBody table={table} />
            </table>
          )}
        </div>
        <div className="grid grid-cols-max-max gap-2">
          <button
            className={`btn btn-warning btn-sm ${selectedCount > 0 ? '' : 'btn-disabled'}`}
            disabled={selectedCount > 0 ? false : true}
            onClick={onShowPrompt}
          >
            Delete {selectedCount}
          </button>
          <button
            className={`btn btn-neutral btn-sm ${selectedCount > 0 ? '' : 'btn-disabled'}`}
            disabled={selectedCount > 0 ? false : true}
            onClick={(): void => setSelected({})}
          >
            Reset
          </button>
        </div>
      </div>
      <dialog id="modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete files</h3>
          <p className="py-4">Are you sure you want to delete {selectedCount} files.</p>
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
    </>
  )
}
