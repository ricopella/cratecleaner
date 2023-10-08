import { deleteFiles } from '@renderer/actions/ipc'
import Loader from '@renderer/components/Loader'
import IndeterminateCheckbox from '@renderer/components/Table/InderminateCheckbox'
import { useMain } from '@renderer/context/MainContext'
import { ADD_TRACKING_DELETE_ID } from '@src/constants'
import { DuplicateFile, ResultsData, ScanResults } from '@src/types'
import {
  ExpandedState,
  createColumnHelper,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { v4 } from 'uuid'
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

  columnHelper.accessor('files.path', {
    header: 'Path',
    cell: (info) => {
      if (info.row.depth === 0) {
        return ''
      }

      const row = info.row.original as unknown as DuplicateFile

      return row?.path ?? ''
    },
    enableGrouping: false
  }),

  columnHelper.accessor('files.title', {
    header: 'Title',
    cell: (info) => {
      if (info.row.depth === 0) {
        return ''
      }

      const row = info.row.original as unknown as DuplicateFile

      return row?.title ?? ''
    },
    enableGrouping: false
  }),
  columnHelper.accessor('files.artist', {
    header: 'Artist',
    cell: (info) => {
      if (info.row.depth === 0) {
        return ''
      }

      const row = info.row.original as unknown as DuplicateFile

      return row?.artist ?? ''
    },
    enableGrouping: false
  }),
  columnHelper.accessor('files.album', {
    header: 'Album',
    cell: (info) => {
      if (info.row.depth === 0) {
        return ''
      }

      const row = info.row.original as unknown as DuplicateFile

      return row?.album ?? ''
    },
    enableGrouping: false
  }),
  columnHelper.accessor('files.genre', {
    header: 'Genre',
    cell: (info) => {
      if (info.row.depth === 0) {
        return ''
      }

      const row = info.row.original as unknown as DuplicateFile

      return row?.genre ?? ''
    },
    enableGrouping: false
  }),
  columnHelper.accessor('files.bpm', {
    header: 'BPM',
    cell: (info) => {
      if (info.row.depth === 0) {
        return ''
      }

      const row = info.row.original as unknown as DuplicateFile

      return row?.bpm ?? ''
    },
    enableGrouping: false
  }),
  columnHelper.accessor('files.type', {
    header: 'Type',
    cell: (info) => {
      if (info.row.depth === 0) {
        return ''
      }

      const row = info.row.original as unknown as DuplicateFile

      return row?.type ?? ''
    },
    enableGrouping: false,
    size: 32
  }),
  columnHelper.accessor('files.crates', {
    header: 'Crates',
    cell: (info) => {
      if (info.row.depth === 0) {
        return ''
      }

      const row = info.row.original as unknown as DuplicateFile

      return row?.crates.join(', ') ?? ''
    },
    enableGrouping: false,
    size: 32
  }),
  columnHelper.display({
    id: 'duplicateCount',
    size: 24,
    header: () => <span>Dupe Count</span>,
    cell: ({ row }) => (row.depth === 0 ? row.original.files.length : ''),
    enableGrouping: false
  })
]
export default function Results({ id }: { id: string }): JSX.Element {
  const { state, dispatch } = useMain()
  const scan = state.scans[id]
  const results: ScanResults = scan.results ?? { files: {} }
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const data: ResultsData[] = useMemo(() => {
    return transformScanResultsToRows(results, scan)
  }, [results, scan])

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
        type: file.type,
        artist: file.metadata?.artist ?? '',
        album: file.metadata?.album ?? '',
        title: file.metadata?.title ?? '',
        bpm: file.metadata?.bpm ?? '',
        genre: file.metadata?.genre?.[0] ?? '',
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
    const filesToDelete = Object.keys(selected).map((key) => {
      const [rowId, fileIndex] = key.split('.')
      return data[Number(rowId)].files[Number(fileIndex)].path
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

    setSelected({})
  }
  console.log({ scan })
  return (
    <>
      <div className={classNames.container}>
        <div>
          {scan.deletedFiles.map((del) => (
            <div key={del.id}>{del.count}</div>
          ))}
        </div>
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
    </>
  )
}
