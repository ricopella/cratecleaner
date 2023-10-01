import { HeaderGroup, flexRender } from '@tanstack/react-table'

interface TableHeaderProps<D extends object> {
  headerGroups: HeaderGroup<D>[]
}

const TableHeader = <T extends object>({ headerGroups }: TableHeaderProps<T>): JSX.Element => {
  return (
    <thead>
      {headerGroups.map((headerGroup) => (
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
  )
}

export default TableHeader
