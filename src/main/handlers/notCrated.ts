import { basename, extname } from 'path'
import { FileInfo, ScanConfiguration } from '../../types'
import { getFiles } from './duplicates'
import { getCratesAndFiles } from './utils'

export async function getNotCratedFiles(configuration: ScanConfiguration): Promise<
  [
    {
      uncratedFiles: Map<string, FileInfo[]>
      errors: string[]
    },
    ReturnType<typeof getCratesAndFiles>
  ]
> {
  const { crates, errorMessages } = await getCratesAndFiles()
  const filesErrors = []
  // Create a map of file paths from the Serato crates
  const crateFilePaths = new Map<string, true>()
  crates.forEach((crate) => {
    crate.subcrate.songs.forEach((file) => {
      crateFilePaths.set(file.path, true)
    })
  })

  const uncratedFiles = new Map<string, FileInfo[]>()
  for (const dir of configuration.directoryPaths) {
    for await (const { file } of getFiles(dir, filesErrors)) {
      if (file && !crateFilePaths.has(file)) {
        // You might need to create a FileInfo object for each file
        const fileInfo: FileInfo = {
          path: file,
          name: basename(file),
          type: extname(file).substring(1)
        }
        if (uncratedFiles.has(fileInfo.type)) {
          uncratedFiles.get(fileInfo.type)!.push(fileInfo)
        } else {
          uncratedFiles.set(fileInfo.type, [fileInfo])
        }
      }
    }
  }

  return [
    { uncratedFiles, errors: filesErrors },
    { crates, errorMessages }
  ]
}
