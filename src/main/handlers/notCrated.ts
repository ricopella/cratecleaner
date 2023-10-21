import { basename, extname } from 'path'
import { FileWithMetadata, ScanConfiguration } from '../../types'
import { processBatch } from './audioMetadata'
import { getFiles } from './duplicates'
import { getCratesAndFiles } from './utils'

export async function getNotCratedFiles(configuration: ScanConfiguration): Promise<{
  files: Record<string, FileWithMetadata[]>
  errors: string[]
}> {
  const { type } = configuration

  const { crates, errorMessages } = await getCratesAndFiles()
  const filesErrors = []
  const crateFilePaths = new Map<string, true>()
  crates.forEach((crate) => {
    crate.subcrate.songs.forEach((file) => {
      crateFilePaths.set(file.path, true)
    })
  })

  const filesMap = new Map<string, FileWithMetadata[]>()
  for (const dir of configuration.directoryPaths) {
    for await (const { file } of getFiles(dir, filesErrors))
      if (file && !crateFilePaths.has(file)) {
        const fileType = extname(file).substring(1)
        // only process files matching the type (audi or image)
        if (
          (type === 'audio' && !['mp3', 'wav', 'flac'].includes(fileType)) ||
          (type === 'image' && !['jpg', 'jpeg', 'png'].includes(fileType))
        ) {
          continue
        }

        const fileInfo: FileWithMetadata = {
          crates: [],
          metadata: {},
          name: basename(file),
          path: file,
          type: fileType
        }
        if (!filesMap.has(fileInfo.path)) {
          filesMap.set(fileInfo.path, [fileInfo])
        }
      }
  }

  if (type === 'audio') {
    const paths = Array.from(filesMap.values())
      .flat()
      .map((file) => file.path)
    const metadataResults = await processBatch(paths)

    for (const [path, files] of filesMap.entries()) {
      const mergedFiles: FileWithMetadata[] = files.map((file) => {
        const matchingMetadata = metadataResults.find((metadata) => file.path === metadata.path)
        return {
          ...file,
          metadata: matchingMetadata ? matchingMetadata : null,
          crates: []
        }
      })
      filesMap.set(path, mergedFiles)
    }
  }

  return {
    files: Object.fromEntries(filesMap),
    errors: [...errorMessages, ...filesErrors]
  }
}
