import { FilesDirectory } from '@prisma/client'
import Body from '@renderer/components/Table/Body'
import TableFooter from '@renderer/components/Table/Footer'
import TableHeader from '@renderer/components/Table/Header'
import IndeterminateCheckbox from '@renderer/components/Table/InderminateCheckbox'
import { useMain } from '@renderer/context/MainContext'
import { TableProvider, useTableContext } from '@renderer/context/TableContext'
import useFetchDirectories from '@renderer/hooks/useDirectoriesList'
import { useIpcListener } from '@renderer/hooks/useIPCListener'
import { NEW_FILES_DIRECTORY } from '@src/constants'
import { DatabaseOperationResult } from '@src/types'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useEffect } from 'react'
import ActionsRow from './ActionsRow'

const classNames = {
  container: 'h-full w-full grid grid-rows-max-1fr-max',
  table: 'table table-xs'
}
const columnHelper = createColumnHelper<FilesDirectory>()

const columns = [
  columnHelper.display({
    id: 'select',
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
      <div className="px-1">
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
]

const List = (): JSX.Element => {
  const { state, dispatch } = useMain()
  const { rowSelection, setRowSelection, setError } = useTableContext()

  const { status, fetchData } = useFetchDirectories()
  useIpcListener(NEW_FILES_DIRECTORY, (res: DatabaseOperationResult<FilesDirectory>) => {
    if (res.success === false) {
      setError(res.error)
      return
    }

    dispatch({
      type: NEW_FILES_DIRECTORY,
      payload: {
        directorySrc: res.data
      }
    })
  })

  useEffect(() => {
    fetchData()
  }, [])

  const directories = state.directorySrcs

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
      // TODO: need to figure out loading
      return <span>Loading...</span>
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

export default function Directories(): JSX.Element {
  return (
    <TableProvider>
      <div className={classNames.container}>
        <div>
          <span className="text-md text-info">Configuration</span>
        </div>
        <List />
        <ActionsRow />
      </div>
    </TableProvider>
  )
}
