import { Scan } from '@prisma/client'
import { ExtendedScan, ScanConfigurationSchema, ScanResultsSchema } from '@src/types'

export const transformScan = (scan: Scan): ExtendedScan => {
  const configurationRes = ScanConfigurationSchema.safeParse(JSON.parse(scan.configuration))

  const resultsRes = ScanResultsSchema.safeParse(JSON.parse(scan.results ?? '{}'))

  if (configurationRes.success === false || resultsRes.success === false) {
    console.error('Error parsing scan', {
      resultsRes,
      configurationRes
    })

    // TODO: what should happen here?
    return {
      ...scan,
      configuration: { directoryPaths: [] },
      results: { files: {} }
    }
  }

  return {
    ...scan,
    configuration: configurationRes.data,
    results: resultsRes.data
  }
}
