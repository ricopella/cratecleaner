import { FileInfo, FileWithMetadata } from '@src/types'
import { processBatch } from './audioMetadata'

export const getDuplicatesWithMetadata = async (
  duplicates: Map<string, FileInfo[]>
): Promise<Map<string, FileWithMetadata[]>> => {
  const hashMap: Map<string, FileWithMetadata[]> = new Map()
  const duplicatePaths = Array.from(duplicates.values())
    .flat()
    .map((file) => file.path)

  const metadataResults = await processBatch(duplicatePaths)

  for (const [hash, files] of duplicates.entries()) {
    const mergedFiles: FileWithMetadata[] = files.map((file) => {
      const matchingMetadata = metadataResults.find((metadata) => file.path === metadata.path)
      return {
        ...file,
        metadata: matchingMetadata ? matchingMetadata : null
      }
    })

    hashMap.set(hash, mergedFiles)
  }

  return hashMap
}
