import { FilesDirectory } from '@prisma/client'
import Loader from '@renderer/components/Loader'
import Body from '@renderer/components/Table/Body'
import TableFooter from '@renderer/components/Table/Footer'
import TableHeader from '@renderer/components/Table/Header'
import IndeterminateCheckbox from '@renderer/components/Table/InderminateCheckbox'
import { useMain } from '@renderer/context/MainContext'
import { TableProvider, useTableContext } from '@renderer/context/TableContext'
import useFetchDirectories from '@renderer/hooks/useDirectoriesList'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { memo, useEffect, useMemo } from 'react'
import ActionsRow from './ActionsRow'

const classNames = {
  container: 'h-full w-full grid grid-rows-max-1fr-max',
  table: 'table table-xs'
}
const columnHelper = createColumnHelper<FilesDirectory>()

const List = (): JSX.Element => {
  const { state } = useMain()
  const { rowSelection, setRowSelection } = useTableContext()

  const { status, fetchData } = useFetchDirectories()

  useEffect(() => {
    fetchData()
  }, [])

  const directories = state.directorySrcs

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        size: 16,
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="pl-8">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler()
              }}
            />
          </div>
        )
      }),
      columnHelper.accessor('id', {
        id: 'id'
      }),
      columnHelper.accessor('path', {
        id: 'path',
        cell: (info) => info.getValue(),
        header: () => <span>Path</span>
      })
    ],
    []
  )

  const table = useReactTable({
    data: directories ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility: {
        id: false
      },
      rowSelection
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection
  })

  const renderList = (): JSX.Element => {
    if (status === 'loading') {
      return (
        <div className="h-full w-full flex justify-center items-center">
          <Loader />
        </div>
      )
    }

    return (
      <table className={classNames.table}>
        <TableHeader<FilesDirectory> headerGroups={table.getHeaderGroups()} />
        <Body<FilesDirectory> rows={table.getRowModel().rows} />
        <TableFooter<FilesDirectory> footerGroups={table.getFooterGroups()} />
      </table>
    )
  }

  return <div className="overflow-x-auto">{renderList()}</div>
}

const MemoizedList = memo(List)

export default memo(function Directories(): JSX.Element {
  return (
    <TableProvider>
      <div className={classNames.container}>
        <div>
          <span className="text-md text-info">Configuration</span>
        </div>
        <MemoizedList />
        <ActionsRow />
      </div>
    </TableProvider>
  )
})
