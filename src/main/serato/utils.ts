import fs from 'node:fs'
import path from 'node:path'
import { CrateSong, Subcrate } from '../../types'

const INVALID_CHARACTERS_REGEX = /[^A-Za-z0-9_ ]/gi

export const parse = (contents: string): string[] => {
  const indices: number[] = []
  for (let i = 0; i < contents.length; i++) {
    if (contents.slice(i, i + 4) === 'ptrk') {
      indices.push(i)
    }
  }

  const songs: string[] = []
  indices.forEach((value, index) => {
    const start = value + 9 // + 9 to skip the 'ptrk' itself and the bytes for size
    const isLast = index === indices.length - 1
    const end = isLast ? contents.length : indices[index + 1] - 8 // -8 to remove 'otrk' and size bytes

    let filepath = contents.slice(start, end)
    filepath = filepath.replace(/\0/g, '') // remove null-termination bytes
    songs.push(path.resolve('/', filepath))
  })
  return songs
}

export const sanitizeFilename = (filename: string): string => {
  return filename.replace(INVALID_CHARACTERS_REGEX, '-')
}

export function getSubcratesFolder(seratoFolder: string): string {
  return path.join(seratoFolder, 'SubCrates')
}

function parseCrate(filepath: string): CrateSong[] {
  const contents = fs.readFileSync(filepath, 'ascii')

  // Split the contents into lines, and assume each line is a song path
  const lines = contents.split('\n').map((line) => line.trim())

  // Extract song names and paths, and decode them from UTF-16LE
  const songs = lines
    .map((line) => {
      const decodedPaths = parse(line)

      // Derive song names from the decoded paths
      const songEntries = decodedPaths.map((p) => {
        const name = path.basename(p)
        return { name, path: p }
      })

      return songEntries
    })
    .flat() // Flatten the nested arrays

  return songs
}

export function getSubcrate(filepath: string): Subcrate {
  const crateName = path.basename(filepath, '.crate')
  const songs = parseCrate(filepath)
  return { name: crateName, songs }
}
