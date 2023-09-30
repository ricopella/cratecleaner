import { FilesDirectory } from '@prisma/client'
import { useMain } from '@renderer/actions/context'
import { getFilesDirectories, openFilesDirectoryDialog } from '@renderer/actions/ipc'
import { useFetchAndDispatch } from '@renderer/hooks/useFetchAndDispatch'

import { useIpcListener } from '@renderer/hooks/useIPCListener'
import { GET_FILES_DIRECTORIES, NEW_FILES_DIRECTORY } from '@src/constants'
import { DatabaseOperationResult } from '@src/types'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import { HTMLProps, useEffect, useRef, useState } from 'react'

const classNames = {
  container: 'h-full w-full grid grid-rows-max-1fr-max',
  btn: 'btn btn-sm',
  table: 'table table-xs'
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>): JSX.Element {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return <input type="checkbox" ref={ref} className={className + ' cursor-pointer'} {...rest} />
}

const columnHelper = createColumnHelper<FilesDirectory>()

const defaultColumns = [
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
  // columnHelper.display({
  //   id: 'fileDirectory',
  //   // accessorFn: row => row.path,
  //   cell: (info) => {
  //     const { path } = info.getValue()
  //     const parts = path.split('/')
  //     return parts[parts.length - 2]
  //   },
  //   header: (p) => <span>Directory</span>
  // }),
  columnHelper.accessor('path', {
    id: 'path',
    cell: (info) => info.getValue(),
    header: () => <span>Path</span>
  })
]

export const useFetchDirectories = (): {
  fetchData: () => void
  status: string
  reset: () => void
  message: string | null
} => {
  const { dispatch } = useMain()

  const fetchFn = getFilesDirectories
  const dispatchFn = (data: FilesDirectory[]): void => {
    dispatch({
      type: GET_FILES_DIRECTORIES,
      payload: {
        directorySrcs: data
      }
    })
  }

  const { fetchData, status, reset, message } = useFetchAndDispatch(fetchFn, dispatchFn)

  return { fetchData, status, reset, message }
}

const List = (): JSX.Element => {
  const { state, dispatch } = useMain()
  const [error, setError] = useState<string | null>(null) // create directory error
  const [rowSelection, setRowSelection] = useState({})

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
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    state: {
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
  return (
    <div className={classNames.container}>
      <div>One</div>
      <List />
      <div>
        <button onClick={openFilesDirectoryDialog} className={classNames.btn}>
          +
        </button>
        <button className={classNames.btn}>-</button>
      </div>
    </div>
  )
}
