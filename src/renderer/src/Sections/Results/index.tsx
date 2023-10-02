import IndeterminateCheckbox from '@renderer/components/Table/InderminateCheckbox'
import { useMain } from '@renderer/context/MainContext'
import { DuplicateFile, ScanResults } from '@src/types'
import {
  ExpandedState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'

const classNames = {
  container: 'h-full w-full grid grid-rows-max-1fr ',
  table: 'table table-xs',
  tableContainer: 'h-full w-full overflow-y-scroll overflow-x-scroll'
}

const columnHelper = createColumnHelper<{
  id: string
  name: string
  files: DuplicateFile[]
}>()

// Define columns
const columns = [
  columnHelper.accessor('id', {
    id: 'id',
    enableGrouping: true,
    cell: ({ row, getValue }) => (
      <div
        style={{
          paddingLeft: `${row.depth * 2}rem`
        }}
      >
        <>
          {row.depth === 0 ? (
            <>
              {/* This is a parent row */}
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler()
                }}
              />{' '}
              {row.getCanExpand() ? (
                <button
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                    style: { cursor: 'pointer' }
                  }}
                >
                  {row.getIsExpanded() ? '👇' : '👉'}
                </button>
              ) : (
                '🔵'
              )}{' '}
              {getValue()} (Dupe Count: {row.original.files.length})
            </>
          ) : (
            <>
              {/* This is a child row */}
              File Path: {row.original.path}, File Type: {row.original.type}
            </>
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
    id: 'duplicateCount',
    header: () => <span>Dupe Count</span>,
    cell: ({ row }) => row.original.files.length,
    enableGrouping: false
  }),
  columnHelper.accessor('path', {
    cell: (info) => info.getValue(),
    enableGrouping: false
  }),
  columnHelper.accessor('type', {
    cell: (info) => info.getValue(),
    enableGrouping: false
  })
]
export default function Results({ id }: { id: string }): JSX.Element {
  const { state } = useMain()
  const scan = state.scans[id]
  const results: ScanResults = scan.results ?? { files: {} }
  const [expanded, setExpanded] = useState<ExpandedState>({})

  console.log({ expanded })
  // Prepare data
  const data = useMemo(() => {
    // Flatten your results object into an array for react-table
    // Add the hash ID to each row
    return Object.entries(results.files).map(([parentId, files]) => {
      return {
        id: parentId,
        name: files[0].name,
        files
      }
    })
  }, [results])
  console.log({ data })

  // Create an instance of the table
  const table = useReactTable<{
    id: string
    name: string
    files: DuplicateFile[]
  }>({
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
    debugTable: true
  })

  return (
    <div className={classNames.container}>
      <div>Configuration</div>
      <div className={classNames.tableContainer}>
        <table className={classNames.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        width: header.getSize()
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {header.column.getCanGroup() ? (
                            // If the header can be grouped, let's add a toggle
                            <button
                              {...{
                                onClick: header.column.getToggleGroupingHandler(),
                                style: {
                                  cursor: 'pointer'
                                }
                              }}
                            >
                              {header.column.getIsGrouped()
                                ? `🛑(${header.column.getGroupedIndex()}) `
                                : `👊 `}
                            </button>
                          ) : null}{' '}
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      )}
                      {/* TODO: create resizer component */}
                      <div
                        {...{
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                          className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`
                        }}
                      />
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                // <tr key={row.id}>
                //   {row.getVisibleCells().map((cell) => {
                //     return (
                //       <td
                //         key={cell.id}
                //         {
                //           ...{
                //             // style: {
                //             //   background: cell.getIsGrouped()
                //             //     ? '#0aff0082'
                //             //     : cell.getIsAggregated()
                //             //     ? '#ffa50078'
                //             //     : cell.getIsPlaceholder()
                //             //     ? '#ff000042'
                //             //     : 'white'
                //             // }
                //           }
                //         }
                //       >
                //         {cell.getIsGrouped() ? (
                //           // If it's a grouped cell, add an expander and row count
                //           <>
                //             <button
                //               {...{
                //                 onClick: row.getToggleExpandedHandler(),
                //                 style: {
                //                   cursor: row.getCanExpand() ? 'pointer' : 'normal'
                //                 }
                //               }}
                //             >
                //               {row.getIsExpanded() ? '👇' : '👉'}{' '}
                //               {flexRender(cell.column.columnDef.cell, cell.getContext())} (
                //               {row.subRows.length})
                //             </button>
                //           </>
                //         ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                //           // Otherwise, just render the regular cell
                //           flexRender(cell.column.columnDef.cell, cell.getContext())
                //         )}
                //       </td>
                //     )
                //   })}
                // </tr>
                <>
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      )
                    })}
                  </tr>
                  {row.getIsExpanded() &&
                    row.subRows.map((subRow) => {
                      return (
                        <tr key={subRow.id}>
                          {subRow.getVisibleCells().map((cell) => {
                            return (
                              <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
