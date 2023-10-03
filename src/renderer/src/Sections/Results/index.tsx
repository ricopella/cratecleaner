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
  container: 'h-full w-full grid grid-rows-max-1fr ',
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
                    <ArrowRight className="w-4 h-4 text-accent-content fill-current transform rotate-90" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-accent-content fill-current" />
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
    getSubRows: (row) => {
      return row.files.map((file, fileIndex) => ({
        id: `${row.id}-${fileIndex}`, // Generate a unique ID for the sub-row
        name: file.name,
        path: file.path,
        files: []
      }))
    },
    state: {
      expanded
    },
    debugTable: true,
    columnResizeMode: 'onChange'
  })

  return (
    <div className={classNames.container}>
      <div>Configuration</div>
      <div className={classNames.tableContainer}>
        <table className={classNames.table}>
          <TableHeader table={table} />
          <TableBody table={table} />
        </table>
      </div>
    </div>
  )
}
