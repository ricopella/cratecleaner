import { HeaderGroup, flexRender } from '@tanstack/react-table'

interface TableFooterProps<T extends object> {
  footerGroups: HeaderGroup<T>[]
}

const TableFooter = <T extends object>({ footerGroups }: TableFooterProps<T>): JSX.Element => {
  return (
    <tfoot>
      {footerGroups.map((footerGroup) => (
        <tr key={footerGroup.id}>
          {footerGroup.headers.map((header) => (
            <th key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.footer, header.getContext())}
            </th>
          ))}
        </tr>
      ))}
    </tfoot>
  )
}

export default TableFooter
