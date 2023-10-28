import {
  duplicateImageColumns,
  duplicatesColumns,
  unCratedColumns
} from '@renderer/Sections/Results/columns'
import useMain from '@renderer/context/hooks/useMain'
import useTableContext from '@renderer/context/hooks/useTableContext'
import { useEffect, useMemo } from 'react'

const columMap = {
  duplicateAudio: duplicatesColumns,
  duplicateImage: duplicateImageColumns,
  uncrated: unCratedColumns
}

const ColumnSelection = ({ id }: { id: string }): JSX.Element => {
  const { state } = useMain()
  const scan = state.scans[id]
  const { type, scanType, includeCrates } = scan.configuration
  const { columnVisibility, setColumnVisibility } = useTableContext()

  const columns: { key: string; name: string }[] = useMemo(() => {
    if (type === 'image') {
      return columMap['duplicateImage']
        .map((col) => ({
          key: col.id as string,
          name: col.header as string
        }))
        .filter((col) => col.key && col.key !== 'id')
    }

    if (scanType === 'duplicate') {
      return columMap['duplicateAudio']
        .map((col) => ({
          key: col.id as string,
          name: col.header as string
        }))
        .filter((col) => col.key && (includeCrates || col.key !== 'crates') && col.key !== 'id')
    }

    if (scanType === 'not_crated') {
      return columMap['uncrated']
        .map((col) => ({
          key: col.id as string,
          name: col.header as string
        }))
        .filter((col) => col.key && col.key !== 'id')
    }

    return []
  }, [type, scanType, includeCrates])

  useEffect(() => {
    // on mount set all to true except crates
    setColumnVisibility((cur) => {
      return columns.reduce(
        (acc, col) => ({ ...acc, [col.key]: col.key === 'crates' ? cur.crates ?? true : true }),
        {}
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
            <label>
              <input
                type="checkbox"
                checked={columnVisibility[col.key] !== undefined ? columnVisibility[col.key] : true}
                onChange={(): void => handleCheckboxChange(col.key)}
              />
              <span>{col.name}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ColumnSelection
