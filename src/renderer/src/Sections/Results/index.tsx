import Loader from '@renderer/components/Loader'
import Body from '@renderer/components/Table/Body'
import { useMain } from '@renderer/context/MainContext'
import { TableProvider, useTableContext } from '@renderer/context/TableContext'
import { ResultsData, ScanResults } from '@src/types'
import { RankingInfo } from '@tanstack/match-sorter-utils'
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import Header from '../../components/Table/Header'
import ActionsRow from './ActionsRow'
import ConfigurationPanel from './ConfigurationPanel'
import DeleteConfirmModal from './DeleteConfirmModal'
import { duplicateImageColumns, duplicatesColumns, unCratedColumns } from './columns'
import { fuzzyFilter, transformScanResultsToRows } from './utils'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const classNames = {
  container: 'h-full w-full grid grid-rows-1fr-max sm:grid-rows-max-1fr-max gap-2',
  table: 'table table-xs',
  tableContainer: 'h-full w-full overflow-y-auto'
}

const Table = ({ id }: { id: string }): JSX.Element => {
  const { state } = useMain()
  const {
    expanded,
    filter,
    columnVisibility,
    setColumnVisibility,
    setFilter,
    setExpanded,
    rowSelection,
    setRowSelection
  } = useTableContext()
  const scan = state.scans[id]
  const results: ScanResults = scan.results ?? { files: {} }
  const [sorted, setSorting] = useState<SortingState>([])
  const data: ResultsData[] = useMemo(() => {
    return transformScanResultsToRows(results, scan)
  }, [results, scan])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const columns = useMemo<ColumnDef<ResultsData>[]>(() => {
    if (scan.configuration.type === 'image') {
      return duplicateImageColumns
    }

    if (scan.configuration.scanType === 'duplicate') {
      return duplicatesColumns
    }

    if (scan.configuration.scanType === 'not_crated') {
      return unCratedColumns
    }

    return []
  }, [scan])

  const table = useReactTable<ResultsData>({
    columnResizeMode: 'onChange',
    columns,
    data,
    debugTable: true,
    enableRowSelection: true,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: fuzzyFilter,
    onColumnFiltersChange: setColumnFilters,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setFilter,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getSubRows: (row) => {
      if (row.resultType === 'duplicate') {
        if (scan.configuration.type === 'image') {
          return row.files.map((file, fileIndex) => ({
            id: `${row.id}-${fileIndex}`,
            name: file.name,
            path: file.path,
            type: file.type,
            metadata: file.metadata,
            files: [],
            resultType: 'duplicate'
          }))
        }

        return row.files.map((file, fileIndex) => ({
          id: `${row.id}-${fileIndex}`,
          name: file.name,
          path: file.path,
          type: file.type,
          metadata: file.metadata,
          files: [],
          crates: file.crates,
          resultType: 'duplicate'
        }))
      }

      return []
    },
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      columnVisibility: {
        ...columnVisibility,
        crates: scan.configuration.includeCrates ? columnVisibility.crates : false
      },
      expanded,
      rowSelection: rowSelection,
      sorting: sorted,
      globalFilter: filter,
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
        <div className="h-full w-full flex flex-col justify-center items-center">
          <Loader />
          <div className="text-xs text-warning">Do not close the application until finished.</div>
        </div>
      )
    }

    return (
      <>
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
