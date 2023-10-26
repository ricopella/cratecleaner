import { Table, flexRender } from '@tanstack/react-table'
import React from 'react'

interface TableBodyProps<T extends object> {
  table: Table<T>
  noResultsMessage: string
}

const TableBody = <T extends object>({
  table,
  noResultsMessage
}: TableBodyProps<T>): JSX.Element => {
  return (
    <tbody>
      {table.getRowModel().rows.length === 0 ? (
        <tr key="no_rows">
          <td colSpan={table.getVisibleFlatColumns().length}>{noResultsMessage}</td>
        </tr>
      ) : (
        table.getRowModel().rows.map((row, i) => {
          const isEvenRow = i % 2 === 0
          const bgColorClass = isEvenRow ? 'bg-base-300' : 'bg-base-100'
          // show row in disabled state if selected for deletion
          const textColor = row.getIsSelected() ? 'text-base-content-disabled' : 'text-base-content'

          return (
            <React.Fragment key={`wrapper_${row.id}_${i}`}>
              <tr key={`${row.id}_${i}`} className={`${bgColorClass} px-4`}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={textColor} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {row.getIsExpanded() &&
                row.subRows.map((subRow, subRowIndex) => (
                  <tr key={`sub_${subRow.id}_${subRowIndex}`} className={bgColorClass}>
                    {subRow.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`${
                          subRow.getIsSelected() ? 'text-base-300' : 'text-base-content'
                        }`}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
            </React.Fragment>
          )
        })
      )}
    </tbody>
  )
}

export default TableBody
