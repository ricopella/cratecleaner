import { FilesDirectory } from '@prisma/client'
import Loader from '@renderer/components/Loader'
import Body from '@renderer/components/Table/Body'
import TableHeader from '@renderer/components/Table/Header'
import IndeterminateCheckbox from '@renderer/components/Table/InderminateCheckbox'
import useMain from '@renderer/context/hooks/useMain'
import useTableContext from '@renderer/context/hooks/useTableContext'
import useFetchDirectories from '@renderer/hooks/useDirectoriesList'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo } from 'react'
import { fuzzyFilter } from '../Results/utils'

const classNames = {
  table: 'table table-xs padding-sm w-full'
}
const columnHelper = createColumnHelper<FilesDirectory>()

const List = (): JSX.Element => {
  const { state } = useMain()
  const { rowSelection, setRowSelection } = useTableContext()

  const { status } = useFetchDirectories()

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
          <div>
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
    filterFns: {
      fuzzy: fuzzyFilter
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection
  })

  const renderList = (): JSX.Element => {
    if (status === 'pending') {
      return (
        <div className="h-full w-full flex justify-center items-center">
          <Loader />
        </div>
      )
    }

    return (
      <table className={classNames.table}>
        <TableHeader<FilesDirectory> headerGroups={table.getHeaderGroups()} />
        <Body<FilesDirectory>
          table={table}
          noResultsMessage="No directories selected. Use the buttons below to add/remove directories to scan."
        />
      </table>
    )
  }

  return <div className="overflow-x-auto">{renderList()}</div>
}

export default List
