import { Table, flexRender } from '@tanstack/react-table'

export default function TableBody<T>({ table }: { table: Table<T> }): JSX.Element {
  let parentRowIndex = 0 // Initialize parent row index

  return (
    <tbody>
      {table.getRowModel().rows.map((row) => {
        const isEvenParentRow = parentRowIndex % 2 === 0
        const bgColorClass = isEvenParentRow ? 'bg-base-200' : 'bg-base-200 bg-opacity-parent'

        // Increment parent row index only if it's a parent row
        if (row.depth === 0) {
          parentRowIndex++
        }

        return (
          <>
            <tr key={row.id} className={bgColorClass}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td
                    key={cell.id}
                    style={{
                      width: cell.column.getSize()
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
            {row.getIsExpanded() &&
              row.subRows.map((subRow) => {
                return (
                  <tr key={subRow.id} className={bgColorClass}>
                    {subRow.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id} style={{ width: cell.column.getSize() }}>
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
  )
}
