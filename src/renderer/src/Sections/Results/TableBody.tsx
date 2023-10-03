import { Table, flexRender } from '@tanstack/react-table'

export default function TableBody<T>({ table }: { table: Table<T> }): JSX.Element {
  return (
    <tbody>
      {table.getRowModel().rows.map((row) => {
        return (
          <>
            <tr key={row.id}>
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
                  <tr key={subRow.id}>
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
