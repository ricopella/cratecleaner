import { FilesDirectory } from '@prisma/client'
import { useMain } from '@renderer/actions/context'
import { openFilesDirectoryDialog, removeDirectories } from '@renderer/actions/ipc'
import IndeterminateCheckbox from '@renderer/components/Table/InderminateCheckbox'
import useFetchDirectories from '@renderer/hooks/useDirectoriesList'
import { useIpcListener } from '@renderer/hooks/useIPCListener'
import { NEW_FILES_DIRECTORY, REMOVE_DIRECTORIES } from '@src/constants'
import { DatabaseOperationResult } from '@src/types'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import { isEmpty, keys } from 'ramda'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const classNames = {
  container: 'h-full w-full grid grid-rows-max-1fr-max',
  btn: 'btn btn-sm',
  table: 'table table-xs',
  actionRow: 'grid grid-cols-max-max-1fr',
  errorContainer: 'bg-error-100 p-2 rounded',
  errorText: 'text-sm text-error'
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

const List = ({
  rowSelection,
  setRowSelection
}: {
  rowSelection: Record<string, boolean>
  setRowSelection: Dispatch<SetStateAction<Record<string, boolean>>>
}): JSX.Element => {
  const { state, dispatch } = useMain()
  const [error, setError] = useState<string | null>(null) // create directory error

  const { status, reset, fetchData, message } = useFetchDirectories()
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
      return <div>Loading...</div>
    }

    if (status === 'error') {
      return (
        <div>
          <button onClick={reset}>Try again</button>
          <div>{message ?? error ?? ''}</div>
        </div>
      )
    }

    return (
      <div className="overflow-x-auto">
        <table className={classNames.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.footer, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    )
  }

  return (
    <div>
      {renderList()}
      {error && <div>{error}</div>}
    </div>
  )
}

export default function Directories(): JSX.Element {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null) // remove directory error
  const { dispatch, state } = useMain()

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
      setError(res.error)
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

  return (
    <div className={classNames.container}>
      <div>One</div>
      <List rowSelection={rowSelection} setRowSelection={setRowSelection} />
      <div className={classNames.actionRow}>
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
          {error && <div className={classNames.errorText}>{error}</div>}
        </div>
      </div>
    </div>
  )
}
