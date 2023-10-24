import { concat } from 'ramda'
import { getCrateSrcs } from '../../db/actions'
import { CrateFile, FileInfo, FileWithMetadata, ScanConfiguration } from '../../types'
import { listCrateFiles } from '../serato'
import { processBatch } from './audioMetadata'
import { getDuplicates } from './duplicates'
import { processImageBatch } from './imageMetadata'
import { getNotCratedFiles } from './notCrated'

export const findCratesForFilePath = (crates: CrateFile[], targetPath: string): string[] => {
  const pathInCrates: string[] = []

  for (const crate of crates) {
    const songs = crate.subcrate.songs
    for (const song of songs) {
      if (song.path === targetPath) {
        pathInCrates.push(crate.subcrate.name)
      }
    }
  }

  return pathInCrates
}

export const getDuplicatesWithMetadata = async (
  results: [
    {
      duplicates: Map<string, FileInfo[]>
      errors: string[]
    },
    {
      crates: CrateFile[]
      errorMessages: string[]
    }
  ],
  configuration: ScanConfiguration
): Promise<Map<string, FileWithMetadata[]>> => {
  const hashMap: Map<string, FileWithMetadata[]> = new Map()
  const { duplicates } = results[0]
  const duplicatePaths = Array.from(duplicates.values())
    .flat()
    .map((file) => file.path)

  // only get metadata for audio files
  const metadataResults =
    configuration.type === 'audio'
      ? await processBatch(duplicatePaths)
      : await processImageBatch(duplicatePaths)

  for (const [hash, files] of duplicates.entries()) {
    const mergedFiles: FileWithMetadata[] = files.map((file) => {
      const matchingMetadata = metadataResults.find((metadata) => file.path === metadata.path)

      // go through all crates, create a list that contain the files path
      const crates =
        configuration.includeCrates && configuration.type === 'audio'
          ? findCratesForFilePath(results[1].crates, file.path)
          : []

      return {
        ...file,
        metadata: matchingMetadata ? matchingMetadata : null,
        crates
      }
    })

    hashMap.set(hash, mergedFiles)
  }

  return hashMap
}

export const getCratesAndFiles = async (): Promise<{
  crates: CrateFile[]
  errorMessages: string[]
}> => {
  // first get crate srcs from db
  const crateSrcs = await getCrateSrcs()

  if (!crateSrcs.success) {
    console.error('Could not get crate srcs from db')
    return {
      crates: [],
      errorMessages: ['Could not get crate srcs from db']
    }
  }

  const cratePaths = crateSrcs?.data?.map((crateSrc) => crateSrc.path) ?? []

  // then get crate files from serato
  const res = await listCrateFiles(cratePaths.length > 0 ? cratePaths : undefined)

  return res
}

export const scanTypeHandlers: {
  duplicate: (configuration: ScanConfiguration) => Promise<{
    files: Record<string, FileWithMetadata[]>
    errors: string[]
  }>
  not_crated: (configuration: ScanConfiguration) => Promise<{
    files: Record<string, FileWithMetadata[]>
    errors: string[]
  }>
} = {
  duplicate: async (configuration) => {
    const scanResults = await Promise.all([
      getDuplicates(configuration),
      configuration.includeCrates ? getCratesAndFiles() : { crates: [], errorMessages: [] }
    ])

    const resultsWithMetadata = await getDuplicatesWithMetadata(scanResults, configuration)
    return {
      files: resultsWithMetadata.size > 0 ? Object.fromEntries(resultsWithMetadata) : {},
      errors: concat(scanResults[0].errors, scanResults[1].errorMessages)
    }
  },
  not_crated: async (configuration) => {
    const unCratedResults = await getNotCratedFiles(configuration)
    return unCratedResults
  }
}
