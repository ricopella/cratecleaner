import { ResultsData, ScanResults } from '@src/types'

export const transformScanResultsToRows = (results: ScanResults): ResultsData[] => {
  return Object.entries(results.files).map(([parentId, files]) => {
    return {
      id: parentId,
      name: files[0].name,
      files
    }
  })
}
