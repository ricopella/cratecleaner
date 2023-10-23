import { DeletedFiles, Scan } from '@prisma/client'
import { ExtendedScan, ScanConfigurationSchema, ScanResultsSchema } from '@src/types'
import { transformDeletedFiles } from './transformDeletedFiles'

export const transformScan = (
  scan: Scan & {
    deletedFiles: DeletedFiles[]
  }
): ExtendedScan => {
  const configurationRes = ScanConfigurationSchema.safeParse(JSON.parse(scan.configuration))
  const resultsRes = ScanResultsSchema.safeParse(JSON.parse(scan.results ?? '{}'))
  const deletedFiles = (scan.deletedFiles || []).map((f) => transformDeletedFiles(f))

  if (configurationRes.success === false || resultsRes.success === false) {
    console.error({
      configuration: configurationRes,
      results: resultsRes
    })
    return {
      ...scan,
      configuration: {
        directoryPaths: [],
        includeCrates: false,
        matchType: 'name',
        type: 'audio',
        scanType: configurationRes.success ? configurationRes.data.scanType : 'duplicate'
      },
      results: { files: {} },
      deletedFiles
    }
  }

  return {
    ...scan,
    configuration: configurationRes.data,
    results: resultsRes.data,
    deletedFiles
  }
}
