import { Table, flexRender } from '@tanstack/react-table'
import Resizer from './Resizer'

export default function TableHeader<T>({ table }: { table: Table<T> }): JSX.Element {
  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <th
                key={header.id}
                colSpan={header.colSpan}
                className="relative group"
                style={{
                  width: header.getSize()
                }}
              >
                {header.isPlaceholder ? null : (
                  <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                )}
                <Resizer header={header} />
              </th>
            )
          })}
        </tr>
      ))}
    </thead>
  )
}
