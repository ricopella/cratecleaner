import { ExtendedScan, ResultsData, ScanResults } from '@src/types'
import { flatten, keys, map } from 'ramda'

export const transformScanResultsToRows = (
  results: ScanResults,
  scan: ExtendedScan
): ResultsData[] => {
  const deletedFilesSet = new Set(flatten(map((file) => keys(file.success), scan.deletedFiles)))

  return Object.entries(results.files).map(([parentId, files]) => ({
    id: parentId,
    name: files[0].name,
    files: files.filter((file) => !deletedFilesSet.has(file.path))
  }))
}
