import { FileInfo } from '@src/types'
import { createHash } from 'crypto'
import { createReadStream, promises as fs } from 'fs'
import { basename, extname, resolve } from 'path'

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

async function* getFiles(dir: string): AsyncGenerator<string> {
  const dirents = await fs.readdir(dir, { withFileTypes: true })
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      yield* getFiles(res)
    } else {
      if (!DUPLICATE_FILE_BLACK_LIST.includes(dirent.name)) {
        yield res
      }
    }
  }
}

async function processBatch(paths: string[]): Promise<{ hash: string; info: FileInfo }[]> {
  const results: { hash: string; info: FileInfo }[] = []
  for (const path of paths) {
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
export async function getDuplicates(directories: string[]): Promise<Map<string, FileInfo[]>> {
  const hashMap: Map<string, FileInfo[]> = new Map()

  for (const dir of directories) {
    const filesGenerator = getFiles(dir)

    let batch: string[] = []
    for await (const file of filesGenerator) {
      batch.push(file)
      if (batch.length >= 5) {
        const results = await processBatch(batch)
        for (const { hash, info } of results) {
          const existing = hashMap.get(hash) || []
          hashMap.set(hash, [...existing, info])
        }
        batch = []
      }
    }

    if (batch.length > 0) {
      const results = await processBatch(batch)
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

  return hashMap
}
