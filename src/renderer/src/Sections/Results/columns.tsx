import IndeterminateCheckbox from '@renderer/components/Table/InderminateCheckbox'
import { CommonValue, DuplicateData, DuplicateFile, ResultsData } from '@src/types'
import { ColumnDef } from '@tanstack/react-table'
import ArrowRight from '../../assets/arrow-right.svg?react'
import { getCommonValue } from './utils'

export const duplicatesColumns: ColumnDef<ResultsData>[] = [
  {
    accessorKey: 'id',
    enableGrouping: true,
    size: 16,
    header: undefined,
    cell: ({ row }) => (
      <div
        style={{
          paddingLeft: `${row.depth * 2}rem`
        }}
      >
        <>
          {row.depth === 0 ? (
            <>
              {row.getCanExpand() ? (
                <button
                  className="btn btn-ghost btn-xs rounded-btn"
                  {...{
                    onClick: row.getToggleExpandedHandler()
                  }}
                >
                  {row.getIsExpanded() ? (
                    <ArrowRight className="w-2 h-2 text-accent-content fill-current transform rotate-90" />
                  ) : (
                    <ArrowRight className="w-2 h-2 text-accent-content fill-current" />
                  )}
                </button>
              ) : null}
            </>
          ) : (
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler()
              }}
            />
          )}
        </>
      </div>
    )
  },
  {
    accessorKey: 'name',
    cell: (info) => info.getValue(),
    enableGrouping: false,
    enableSorting: true
  },
  {
    id: 'path',
    accessorKey: 'path',
    header: 'Path',
    enableSorting: false,
    enableGrouping: false,
    cell: (info): string => {
      if (info.row.depth === 0) {
        return ''
      }

      const row = info.row.original as unknown as DuplicateFile

      return row?.path ?? ''
    }
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: 'Title',
    enableSorting: false,
    cell: (info): CommonValue => {
      if (info.row.depth === 0) {
        return getCommonValue(info.row.subRows, 'title')
      }

      const row = info.row.original as unknown as DuplicateFile
      return row?.metadata?.title ?? ''
    },
    enableGrouping: false
  },
  {
    id: 'album',
    accessorKey: 'album',
    header: 'Album',
    enableSorting: false,
    cell: (info): CommonValue => {
      if (info.row.depth === 0) {
        return getCommonValue(info.row.subRows, 'artist')
      }

      const row = info.row.original as unknown as DuplicateFile

      return row?.metadata?.album ?? ''
    },
    enableGrouping: false
  },
  {
    id: 'genre',
    accessorKey: 'genre',
    header: 'Genre',
    enableSorting: false,
    cell: (info): CommonValue => {
      if (info.row.depth === 0) {
        return getCommonValue(info.row.subRows, 'genre')
      }

      const row = info.row.original as unknown as DuplicateFile

      return row?.metadata?.genre ?? ''
    },
    enableGrouping: false
  },
  {
    id: 'bpm',
    header: 'BPM',
    accessorKey: 'bpm',
    enableSorting: false,
    cell: (info): CommonValue => {
      if (info.row.depth === 0) {
        return getCommonValue(info.row.subRows, 'bpm')
      }

      const row = info.row.original as unknown as DuplicateFile

      return row?.metadata?.bpm ?? ''
    },
    enableGrouping: false,
    size: 16
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: 'Type',
    enableSorting: false,
    cell: (info): CommonValue => {
      if (info.row.depth === 0) {
        return getCommonValue(info.row.subRows, 'type')
      }

      const row = info.row.original as unknown as DuplicateFile

      return row?.type ?? ''
    },
    enableGrouping: false,
    size: 32
  },
  {
    id: 'crates',
    accessorKey: 'crates',
    header: 'Crates',
    accessorFn: (row): number => {
      if ((row as DuplicateData)?.files?.length === 0) {
        // @ts-ignore
        return (row.crates || []).length
      }

      return (row as DuplicateData).files.reduce((acc, file) => {
        return acc + (file.crates || []).length
      }, 0)
    },
    cell: (info): JSX.Element | number | string => {
      if (info.row.depth === 0) {
        const count = info.row.subRows.reduce((acc, row) => {
          // @ts-ignore
          return acc + row.original?.crates?.length ?? 0
        }, 0)

        return count
      }

      const row = info.row.original as unknown as DuplicateFile

      const crateCount = row.crates.length

      if (crateCount === 0) {
        return ''
      }

      return (
        <div className="tooltip" data-tip={row.crates.join(', ')}>
          <div className="badge badge-neutral">{crateCount}</div>
        </div>
      )
    },
    enableGrouping: false,
    size: 32
  },
  {
    id: 'duplicateCount',
    size: 24,
    accessorKey: 'duplicateCount',
    accessorFn: (row) => (row as DuplicateData).files.length,
    header: 'Dupe Count',
    cell: ({ row }) => (row.depth === 0 ? (row.original as DuplicateData).files.length : ''),
    enableGrouping: false,
    enableSorting: true
  }
]

export const unCratedColumns: ColumnDef<ResultsData>[] = [
  {
    accessorKey: 'id',
    enableGrouping: true,
    size: 16,
    header: undefined,
    cell: ({ row }) => (
      <div
        style={{
          paddingLeft: `${row.depth * 2}rem`
        }}
      >
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler()
          }}
        />
      </div>
    )
  },
  {
    accessorKey: 'name',
    cell: (info) => info.getValue(),
    enableGrouping: false,
    enableSorting: true
  },
  {
    id: 'path',
    accessorKey: 'path',
    header: 'Path',
    enableSorting: false,
    enableGrouping: false,
    cell: (info) => info.getValue()
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: 'Title',
    enableSorting: false,
    cell: (info) => info.getValue(),
    enableGrouping: false
  },
  {
    id: 'album',
    accessorKey: 'album',
    header: 'Album',
    enableSorting: false,
    cell: (info) => info.getValue(),
    enableGrouping: false
  },
  {
    id: 'genre',
    accessorKey: 'genre',
    header: 'Genre',
    enableSorting: false,
    cell: (info) => info.getValue(),
    enableGrouping: false
  },
  {
    id: 'bpm',
    header: 'BPM',
    accessorKey: 'bpm',
    enableSorting: false,
    cell: (info) => info.getValue(),
    enableGrouping: false,
    size: 16
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: 'Type',
    enableSorting: false,
    cell: (info) => info.getValue(),
    enableGrouping: false,
    size: 32
  }
]
