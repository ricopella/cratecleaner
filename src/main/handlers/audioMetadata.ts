import { IAudioMetadata, parseBuffer } from 'music-metadata'
import fs from 'node:fs'

export type Metadata = IAudioMetadata & { path: string }

export async function processBatch(paths: string[]): Promise<Metadata[]> {
  const results: Metadata[] = []
  for (const path of paths) {
    const buffer = fs.readFileSync(path)
    try {
      const metadata = await parseBuffer(buffer, { mimeType: 'audio/mpeg' }) // Adjust mimeType based on your audio format
      results.push({ ...metadata, path })
    } catch (error) {
      console.error(
        `Error parsing metadata for file: ${path}`,
        (error as { message: string }).message
      )
    }
  }
  return results
}
