import DebouncedInput from '@renderer/components/DebouncedInput'
import ColumnSelection from '@renderer/components/Table/ColumnSelection'
import { useMain } from '@renderer/context/MainContext'
import { useTableContext } from '@renderer/context/TableContext'
import { useMemo } from 'react'

export default function ConfigurationPanel({ id }: { id: string }): JSX.Element {
  const { state } = useMain()
  const scan = state.scans[id]
  const { type, matchType, includeCrates } = scan.configuration
  const { filter, setFilter } = useTableContext()

  const deletedCount = useMemo(
    () => scan.deletedFiles.reduce((acc, del) => acc + del.count, 0),
    [scan.deletedFiles]
  )

  return (
    <div className="p-4 border-2 border-base-200 rounded-md">
      <div className="grid grid-cols-1fr-1fr-max-max gap-4">
        <div className="grid grid-cols-max-max-max gap-4 items-center">
          <div className="badge">Type: {type}</div>
          <div className="badge">Match Type: {matchType}</div>
          <div className="badge">{includeCrates ? 'Crates Included' : 'Crates Excluded'}</div>
        </div>

        <div>
          {scan.deletedFiles.length > 0 && (
            <div className="stat">
              <div className="stat-title">Deleted Count</div>
              <div className="stat-value">{deletedCount}</div>
              <div className="stat-desc">
                {/* TODO: add errors tooltip */}
                {/* {keys(del.errors).length === 0 ? '' : `Errors: ${keys(del.errors).join(', ')}`} */}
              </div>
            </div>
          )}
        </div>

        <ColumnSelection
          columns={[
            {
              key: 'name',
              name: 'Name'
            },
            {
              key: 'path',
              name: 'Path'
            },
            {
              key: 'title',
              name: 'Title'
            },
            {
              key: 'artist',
              name: 'Artist'
            },
            {
              key: 'album',
              name: 'Album'
            },
            {
              key: 'genre',
              name: 'Genre'
            },
            {
              key: 'bpm',
              name: 'BPM'
            },
            {
              key: 'type',
              name: 'Type'
            },
            // TODO: figure out how to not include if no crates specified
            {
              key: 'crates',
              name: 'Crates'
            },
            {
              key: 'duplicateCount',
              name: 'Duplicate Count'
            }
          ]}
        />

        <DebouncedInput
          value={filter ?? ''}
          onChange={(value): void => setFilter(String(value))}
          placeholder="Search by name"
          className="justify-end self-center"
        />
      </div>
    </div>
  )
}
