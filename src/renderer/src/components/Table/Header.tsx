import { HeaderGroup, flexRender } from '@tanstack/react-table'

interface TableHeaderProps<D extends object> {
  headerGroups: HeaderGroup<D>[]
}

const TableHeader = <T extends object>({ headerGroups }: TableHeaderProps<T>): JSX.Element => {
  return (
    <thead className="sticky top-0 bg-base-200">
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
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
            </th>
          ))}
        </tr>
      ))}
    </thead>
  )
}

export default TableHeader
