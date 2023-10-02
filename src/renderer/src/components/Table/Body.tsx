import { Row, flexRender } from '@tanstack/react-table'

interface TableBodyProps<T extends object> {
  rows: Row<T>[]
}

const TableBody = <T extends object>({ rows }: TableBodyProps<T>): JSX.Element => {
  return (
    <tbody>
      {rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

export default TableBody
