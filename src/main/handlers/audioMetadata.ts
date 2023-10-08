import { parseBuffer } from 'music-metadata'
import fs from 'node:fs'
import { extname } from 'node:path'
import { pick } from 'ramda'

export type Metadata = {
  title: string
  artist: string
  genre: string[]
  album: string
  bpm: number
  path: string
  comment: string[]
}

async function getAudioMimeType(path: string): Promise<string | null> {
  const extension = extname(path).toLowerCase()
  switch (extension) {
    case '.mp3':
      return 'audio/mpeg'
    case '.wav':
      return 'audio/wav'
    case '.flac':
      return 'audio/flac'
    // Add more cases for other audio formats as needed
    default:
      return null
  }
}

export async function processBatch(paths: string[]): Promise<Metadata[]> {
  const results: Metadata[] = []
  for (const path of paths) {
    const buffer = fs.readFileSync(path)
    try {
      const mimeType = await getAudioMimeType(path)
      if (!mimeType) {
        console.error(`Could not get mime type for file: ${path}`)
        // TODO: how to handle non-audio files?
        continue
      }
      const metadata = await parseBuffer(buffer, { mimeType })
      const { common } = metadata
      if (!common) {
        console.error(`Could not get metadata for file: ${path}`)
        continue
      }
      const propertiesToPick = ['title', 'artist', 'genre', 'album', 'bpm', 'comment']
      const pickProperties = pick(propertiesToPick)

      const selectedProperties = pickProperties(common)

      results.push(selectedProperties)
    } catch (error) {
      console.error(
        `Error parsing metadata for file: ${path}`,
        (error as { message: string }).message
      )
    }
  }
  return results
}
