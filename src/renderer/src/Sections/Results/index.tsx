import DebouncedInput from '@renderer/components/DebouncedInput'
import Loader from '@renderer/components/Loader'
import Body from '@renderer/components/Table/Body'
import IndeterminateCheckbox from '@renderer/components/Table/InderminateCheckbox'
import { useMain } from '@renderer/context/MainContext'
import { TableProvider, useTableContext } from '@renderer/context/TableContext'
import { DuplicateFile, ResultsData, ScanResults } from '@src/types'
import { RankingInfo } from '@tanstack/match-sorter-utils'
import {
  ColumnFiltersState,
  FilterFn,
  SortingState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import ArrowRight from '../../assets/arrow-right.svg?react'
import Header from '../../components/Table/Header'
import ActionsRow from './ActionsRow'
import ConfigurationPanel from './ConfigurationPanel'
import DeleteConfirmModal from './DeleteConfirmModal'
import { fuzzyFilter, getCommonValue, transformScanResultsToRows } from './utils'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

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
    size: 16,
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

  columnHelper.display({
    id: 'path',
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
  columnHelper.display({
    id: 'title',
    header: 'Title',
    cell: (info) => {
      if (info.row.depth === 0) {
        return getCommonValue(info.row.subRows, 'title')
      }

      const row = info.row.original as unknown as DuplicateFile
      return row?.metadata?.title ?? ''
    },
    enableGrouping: false
  }),
  columnHelper.display({
    id: 'artist',
    header: 'Artist',
    cell: (info) => {
      if (info.row.depth === 0) {
        return getCommonValue(info.row.subRows, 'artist')
      }

      const row = info.row.original as unknown as DuplicateFile

      return row?.metadata?.artist ?? ''
    },
    enableGrouping: false
  }),
    columnHelper.display({
      id: 'album',
      header: 'Album',
      cell: (info) => {
        if (info.row.depth === 0) {
          return getCommonValue(info.row.subRows, 'artist')
        }

        const row = info.row.original as unknown as DuplicateFile

        return row?.metadata?.album ?? ''
      },
      enableGrouping: false
    }),
  columnHelper.display({
    id: 'genre',
    header: 'Genre',
    cell: (info) => {
      if (info.row.depth === 0) {
        return getCommonValue(info.row.subRows, 'genre')
      }

      const row = info.row.original as unknown as DuplicateFile

      return row?.metadata?.genre ?? ''
    },
    enableGrouping: false
  }),
    columnHelper.display({
      id: 'bpm',
      header: 'BPM',
      cell: (info) => {
        if (info.row.depth === 0) {
          return getCommonValue(info.row.subRows, 'bpm')
        }

        const row = info.row.original as unknown as DuplicateFile

        return row?.metadata?.bpm ?? ''
      },
      enableGrouping: false
    }),
  columnHelper.display({
    id: 'type',
    header: 'Type',
    cell: (info) => {
      if (info.row.depth === 0) {
        return getCommonValue(info.row.subRows, 'type')
      }

      const row = info.row.original as unknown as DuplicateFile

      return row?.type ?? ''
    },
    enableGrouping: false,
    size: 32
  }),

  columnHelper.display({
    id: 'crates',
    header: 'Crates',
    cell: (info) => {
      if (info.row.depth === 0) {
        const count = info.row.subRows.reduce((acc, row) => {
          // @ts-ignore
          return acc + row.original?.crates?.length ?? 0
        }, 0)

        return count
      }

      const row = info.row.original as unknown as DuplicateFile

      const crateCount = row.crates.length

      if (crateCount === 0) {
        return ''
      }

      return (
        <div className="tooltip" data-tip={row.crates.join(', ')}>
          <div className="badge badge-neutral">{crateCount}</div>
        </div>
      )
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

const Table = ({ id }: { id: string }): JSX.Element => {
  const { state } = useMain()
  const { expanded, setExpanded, rowSelection, setRowSelection } = useTableContext()
  const scan = state.scans[id]
  const results: ScanResults = scan.results ?? { files: {} }
  const [sorted, setSorting] = useState<SortingState>([])
  const data: ResultsData[] = useMemo(() => {
    return transformScanResultsToRows(results, scan)
  }, [results, scan])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable<ResultsData>({
    columnResizeMode: 'onChange',
    columns,
    data,
    debugTable: true,
    enableRowSelection: true,
    enableSorting: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: fuzzyFilter,
    onColumnFiltersChange: setColumnFilters,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSubRows: (row) => {
      return row.files.map((file, fileIndex) => ({
        id: `${row.id}-${fileIndex}`,
        name: file.name,
        path: file.path,
        type: file.type,
        metadata: file.metadata,
        files: [],
        crates: file.crates
      }))
    },
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      columnVisibility: {
        crates: scan.configuration.includeCrates
      },
      expanded,
      rowSelection: rowSelection,
      sorting: sorted,
      globalFilter,
      columnFilters
    }
  })

  const selectedCount = useMemo(() => {
    return Object.values(rowSelection).filter(Boolean).length
  }, [rowSelection])

  const resetSelected = (): void => {
    setRowSelection({})
  }

  const renderContent = (): JSX.Element => {
    if (scan.status === 'pending') {
      return (
        <div className="h-full w-full flex justify-center items-center">
          <Loader />
        </div>
      )
    }

    return (
      <>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value): void => setGlobalFilter(String(value))}
          placeholder="Search by name..."
        />
        <table className={classNames.table}>
          <Header<ResultsData> headerGroups={table.getHeaderGroups()} />
          <Body table={table} noResultsMessage="No duplicate files found in this scan." />
        </table>
        <DeleteConfirmModal
          id={id}
          selected={rowSelection}
          reset={resetSelected}
          data={data}
          selectedCount={selectedCount}
        />
      </>
    )
  }

  return <div className={classNames.tableContainer}>{renderContent()}</div>
}

export default function Results({ id }: { id: string }): JSX.Element {
  return (
    <TableProvider>
      <div className={classNames.container}>
        <ConfigurationPanel id={id} />
        <Table id={id} />
        <ActionsRow />
      </div>
    </TableProvider>
  )
}
