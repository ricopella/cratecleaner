import { useTableContext } from '@renderer/context/TableContext'

const ColumnSelection = ({
  columns
}: {
  columns: {
    key: string
    name: string
  }[]
}): JSX.Element => {
  const { columnVisibility, setColumnVisibility } = useTableContext()

  const handleCheckboxChange = (columnName: string): void => {
    setColumnVisibility((prevState) => ({
      ...prevState,
      [columnName]: !prevState[columnName]
    }))
  }

  return (
    <div className="dropdown self-center">
      <label tabIndex={0} className="btn btn-sm btn-ghost btn-outline">
        Columns
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        {columns.map((col) => (
          <li key={col.key}>
            <a>
              <input
                type="checkbox"
                checked={columnVisibility[col.key] !== undefined ? columnVisibility[col.key] : true}
                onChange={(): void => handleCheckboxChange(col.key)}
              />
              <span>{col.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ColumnSelection
