import { getCrateSrcs } from '../../db/actions'
import { CrateFile, FileInfo, FileWithMetadata, ScanConfiguration } from '../../types'
import { listCrateFiles } from '../serato'
import { processBatch } from './audioMetadata'

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
  results: [Map<string, FileInfo[]>, CrateFile[]],
  configuration: ScanConfiguration
): Promise<Map<string, FileWithMetadata[]>> => {
  const hashMap: Map<string, FileWithMetadata[]> = new Map()
  const duplicates = results[0]
  const duplicatePaths = Array.from(duplicates.values())
    .flat()
    .map((file) => file.path)

  // only get metadata for audio files
  const metadataResults = await processBatch(duplicatePaths)

  for (const [hash, files] of duplicates.entries()) {
    const mergedFiles: FileWithMetadata[] = files.map((file) => {
      const matchingMetadata = metadataResults.find((metadata) => file.path === metadata.path)

      // go through all crates, create a list that contain the files path
      const crates = configuration.includeCrates ? findCratesForFilePath(results[1], file.path) : []

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

export const getCratesAndFiles = async (): Promise<CrateFile[]> => {
  // first get crate srcs from db
  const crateSrcs = await getCrateSrcs()

  if (!crateSrcs.success) {
    console.error('Could not get crate srcs from db')
    return []
  }

  const cratePaths = crateSrcs?.data?.map((crateSrc) => crateSrc.path) ?? []

  // then get crate files from serato
  const crates = listCrateFiles(cratePaths.length > 0 ? cratePaths : undefined)

  return crates
}
