import DebouncedInput from '@renderer/components/DebouncedInput'
import ColumnSelection from '@renderer/components/Table/ColumnSelection'
import { useMain } from '@renderer/context/MainContext'
import { useTableContext } from '@renderer/context/TableContext'
import { values } from 'ramda'
import { useMemo } from 'react'
import ErrorIcon from '../../assets/error.svg?react'

export default function ConfigurationPanel({ id }: { id: string }): JSX.Element {
  const { state } = useMain()
  const scan = state.scans[id]
  const { type, matchType, includeCrates } = scan.configuration
  const { filter, setFilter } = useTableContext()

  const deletedCount = useMemo(
    () => scan.deletedFiles.reduce((acc, del) => acc + del.count, 0),
    [scan.deletedFiles]
  )

  const errors = useMemo(() => {
    const errors = scan.deletedFiles.map((del) => del.errors)

    return errors
      .reduce((acc: string[], error: Record<string, string>) => [...acc, ...values(error)], [])
      .join(', ')
  }, [scan.deletedFiles])

  return (
    <div className="p-4 border-2 border-base-200 rounded-md hidden sm:block">
      <div className="grid grid-cols-1fr-1fr-max gap-4">
        <div className="grid md:grid-cols-max-max-max md:gap-4 gap-2 items-center">
          <div className="badge text-xs">Type: {type}</div>
          <div className="badge text-xs">Match Type: {matchType}</div>
          <div className="badge text-xs">
            {includeCrates ? 'Crates Included' : 'Crates Excluded'}
          </div>
        </div>

        {scan.deletedFiles.length > 0 ? (
          <div className="stat p-0">
            <div className="stat-title text-sm">Deleted Count</div>
            <div className="stat-value">{deletedCount}</div>
            <div className="stat-desc">
              {errors.length === 0 ? (
                ''
              ) : (
                <div className="tooltip before:!max-w-max break-word " data-tip={errors}>
                  <button className="btn btn-xs btn-ghost btn-error">
                    Errors:
                    <ErrorIcon className="h-4 w-4 text-warn fill-current" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div />
        )}

        <div className="grid md:grid-cols-max-max md:gap-4 gap-2">
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
              {
                key: 'crates',
                name: 'Crates'
              },
              {
                key: 'duplicateCount',
                name: 'Duplicate Count'
              }
            ].filter((column) => {
              return includeCrates || column.key !== 'crates'
            })}
          />

          <DebouncedInput
            value={filter ?? ''}
            onChange={(value): void => setFilter(String(value))}
            placeholder="Search by name"
            className="justify-end self-center"
          />
        </div>
      </div>
    </div>
  )
}
