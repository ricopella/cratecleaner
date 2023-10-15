import { SCAN_PROGRESS } from '@src/constants'
import { createHash } from 'crypto'
import { ipcMain } from 'electron'
import { createReadStream, promises as fs } from 'fs'
import { basename, extname, resolve } from 'path'
import { FileInfo, ScanConfiguration } from '../../types'

const DUPLICATE_FILE_BLACK_LIST = [
  '.DS_Store',
  'Thumbs.db',
  'desktop.ini',
  '$RECYCLE.BIN',
  '.Trash-1000',
  '.hidden',
  '.bash_history',
  'Icon\r'
]

async function* getFiles(
  dir: string,
  errorMessages: string[]
): AsyncGenerator<{ file?: string; errorMessages?: string[] }> {
  try {
    const dirents = await fs.readdir(dir, { withFileTypes: true })
    for (const dirent of dirents) {
      const res = resolve(dir, dirent.name)
      if (dirent.isDirectory()) {
        yield* getFiles(res, errorMessages)
      } else {
        if (!DUPLICATE_FILE_BLACK_LIST.includes(dirent.name)) {
          yield {
            file: res
          }
        }
      }
    }
  } catch (error) {
    const { code, message } = error as { code: string } & Error
    const errorMessage =
      code === 'ENOENT'
        ? `Directory not found: ${dir}`
        : `An error occurred while reading the directory: ${message}`
    errorMessages.push(errorMessage)
  }

  yield {
    errorMessages
  }
}
async function processBatch(
  paths: string[],
  options: ScanConfiguration
): Promise<{ hash: string; info: FileInfo }[]> {
  const { matchType, type } = options
  const results: { hash: string; info: FileInfo }[] = []

  for (const path of paths) {
    const fileType = extname(path).substring(1)

    // only process files matching the type (audi or image)
    if (
      (type === 'audio' && !['mp3', 'wav', 'flac'].includes(fileType)) ||
      (type === 'image' && !['jpg', 'jpeg', 'png'].includes(fileType))
    ) {
      continue
    }

    if (matchType === 'contents') {
      // Check by content
      const hash = createHash('md5')
      const stream = createReadStream(path)
      stream.on('data', (chunk) => hash.update(chunk))
      await new Promise((resolve) => stream.on('end', resolve))

      const name = basename(path)

      if (DUPLICATE_FILE_BLACK_LIST.includes(name)) {
        continue
      }

      const fileInfo: FileInfo = {
        path,
        name,
        type: extname(path).substring(1)
      }

      results.push({ hash: hash.digest('hex'), info: fileInfo })
    } else {
      // Check by name
      const name = basename(path)
      if (DUPLICATE_FILE_BLACK_LIST.includes(name)) {
        continue
      }

      const fileInfo: FileInfo = {
        path,
        name,
        type: extname(path).substring(1)
      }

      results.push({ hash: name, info: fileInfo })
    }
  }

  return results
}

/**
 * Takes a list of directory paths
 * will traverse each directory and create a hash of each file
 * if the hash is the same, it will add the file to a list of duplicates
 * only files that have duplicates will be returned
 *
 * using a generator to process files in batches and streams to process files
 */
export async function getDuplicates(configuration: ScanConfiguration): Promise<{
  duplicates: Map<string, FileInfo[]>
  errors: string[]
}> {
  const hashMap: Map<string, FileInfo[]> = new Map()
  const globalErrors: string[] = []

  const { directoryPaths } = configuration
  const totalDirs = directoryPaths.length
  let processed = 0
  for (const dir of directoryPaths) {
    ipcMain.emit(SCAN_PROGRESS, { progress: 2 })
    const filesGenerator = getFiles(dir, [])
    ipcMain.emit(SCAN_PROGRESS, { progress: 10 })

    let batch: string[] = []
    for await (const { file, errorMessages } of filesGenerator) {
      if (file) {
        batch.push(file)
      }

      if (errorMessages && errorMessages.length > 0) {
        globalErrors.push(...errorMessages)
      }
    }

    if (batch.length >= 5) {
      const results = await processBatch(batch, configuration)
      const progress = 10 + (processed / totalDirs) * 80 // 10% to 90%
      ipcMain.emit(SCAN_PROGRESS, { progress })

      processed++

      for (const { hash, info } of results) {
        const existing = hashMap.get(hash) || []
        hashMap.set(hash, [...existing, info])
      }
      batch = []
    }
    if (batch.length > 0) {
      const results = await processBatch(batch, configuration)
      const progress = 10 + (processed / totalDirs) * 80 // 10% to 90%
      ipcMain.emit(SCAN_PROGRESS, { progress })

      processed++
      for (const { hash, info } of results) {
        const existing = hashMap.get(hash) || []
        hashMap.set(hash, [...existing, info])
      }
    }
  }

  for (const [hash, files] of hashMap.entries()) {
    if (files.length <= 1) {
      hashMap.delete(hash)
    }
  }

  ipcMain.emit(SCAN_PROGRESS, { progress: 95 })

  return {
    duplicates: hashMap,
    errors: globalErrors
  }
}
