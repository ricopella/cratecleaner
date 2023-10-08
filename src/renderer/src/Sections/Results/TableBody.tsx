import { Table, flexRender } from '@tanstack/react-table'

export default function TableBody<T>({ table }: { table: Table<T> }): JSX.Element {
  let parentRowIndex = 0 // Initialize parent row index

  if (table.getRowModel().rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={table.getVisibleFlatColumns().length}>
            No duplicate files found. Add additional directories
          </td>
        </tr>
      </tbody>
    )
  }

  return (
    <tbody>
      {table.getRowModel().rows.map((row, i) => {
        const isEvenParentRow = parentRowIndex % 2 === 0
        const bgColorClass = isEvenParentRow ? 'bg-base-100' : 'bg-base-300'

        // Increment parent row index only if it's a parent row
        if (row.depth === 0) {
          parentRowIndex++
        }
        return (
          <>
            <tr key={`${row.id}_${i}`} className={bgColorClass}>
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
