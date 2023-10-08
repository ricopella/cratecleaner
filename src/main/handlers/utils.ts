import { CrateFile, FileInfo, FileWithMetadata } from '../../types'
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
  results: [Map<string, FileInfo[]>, CrateFile[]]
): Promise<Map<string, FileWithMetadata[]>> => {
  const hashMap: Map<string, FileWithMetadata[]> = new Map()
  const duplicates = results[0]
  const duplicatePaths = Array.from(duplicates.values())
    .flat()
    .map((file) => file.path)

  const metadataResults = await processBatch(duplicatePaths)

  for (const [hash, files] of duplicates.entries()) {
    const mergedFiles: FileWithMetadata[] = files.map((file) => {
      const matchingMetadata = metadataResults.find((metadata) => file.path === metadata.path)
      // go through all crates, create a list that contain the files path
      const crates = findCratesForFilePath(results[1], file.path)

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
