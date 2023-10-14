import { Table, flexRender } from '@tanstack/react-table'

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
        <tr>
          <td colSpan={table.getVisibleFlatColumns().length}>{noResultsMessage}</td>
        </tr>
      ) : (
        table.getRowModel().rows.map((row, i) => {
          const isEvenRow = i % 2 === 0
          const bgColorClass = isEvenRow ? 'bg-base-300' : 'bg-base-100'

          return (
            <>
              <tr key={`${row.id}_${i}`} className={bgColorClass}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {row.getIsExpanded() &&
                row.subRows.map((subRow, subRowIndex) => (
                  <tr key={`sub_${subRow.id}_${subRowIndex}`} className={bgColorClass}>
                    {subRow.getVisibleCells().map((cell) => (
                      <td key={cell.id} style={{ width: cell.column.getSize() }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
            </>
          )
        })
      )}
    </tbody>
  )
}

export default TableBody
