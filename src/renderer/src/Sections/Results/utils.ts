import { CommonValue, DuplicateFile, ExtendedScan, ResultsData, ScanResults } from '@src/types'
import { rankItem } from '@tanstack/match-sorter-utils'
import { FilterFn, Row } from '@tanstack/react-table'
import { all, comparator, equals, flatten, head, keys, map, path, sort } from 'ramda'

export const transformScanResultsToRows = (
  results: ScanResults,
  scan: ExtendedScan
): ResultsData[] => {
  const deletedFilesSet = new Set(flatten(map((file) => keys(file.success), scan.deletedFiles)))

  if (scan.configuration.scanType === 'not_crated') {
    const mapped = Object.entries(results.files)
      .map(([parentId, files]) => ({
        resultType: 'not_crated' as const,
        id: parentId,
        ...files[0],
        ...files[0].metadata
      }))
      .filter((file) => !deletedFilesSet.has(file.path))

    const sortedResults = sort(
      comparator((a, b) => a.name < b.name),
      mapped
    )
    return sortedResults
  }

  const mapped = Object.entries(results.files).map(([parentId, files]) => ({
    id: parentId,
    name: files[0].name,
    files: files.filter((file) => !deletedFilesSet.has(file.path)),
    resultType: 'duplicate' as const
  }))

  const sortedResults = sort(
    comparator((a, b) => a.name < b.name),
    mapped
  )

  return sortedResults
}

export const fuzzyFilter: FilterFn<ResultsData> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

type MetadataKey =
  | 'album'
  | 'artist'
  | 'genre'
  | 'title'
  | 'comment'
  | 'bpm'
  | 'type'
  | 'fileSize'
  | 'created'
  | 'modified'

// if all values are the same, return that value, otherwise return ''
export const getCommonValue = (subRows: Row<ResultsData>[], key: MetadataKey): CommonValue => {
  const values = map(
    (row) =>
      path(key === 'type' ? [key] : ['metadata', key], row.original as unknown as DuplicateFile),
    subRows
  ) as (string | number | string[] | null)[]
  const commonValue = all(equals(head(values)), values)
  return commonValue ? head(values) : ''
}
