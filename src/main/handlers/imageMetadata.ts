import { load } from 'exifreader'
import { readFile, stat } from 'node:fs/promises'

export type ImageMetadata = {
  path: string
  fileSize: number
  dimensions: { width: number | null; height: number | null }
  created: Date | null
  modified: Date | null
  cameraModel: string | null
  lensModel: string | null
}

export async function processImageBatch(paths: string[]): Promise<ImageMetadata[]> {
  const results: ImageMetadata[] = []

  const settledPromises = await Promise.allSettled(
    paths.map(async (path) => {
      try {
        const stats = await stat(path)
        const buffer = await readFile(path)
        const tags = load(buffer)

        const dimensions =
          tags['Image Width'] && tags['Image Height']
            ? { width: tags['Image Width'].value, height: tags['Image Height'].value }
            : { width: null, height: null }

        const created = tags['Date Time Original']
          ? new Date(tags['Date Time Original'].description)
          : null
        const modified = stats.mtime
        const cameraModel = tags['Model'] ? tags['Model'].description : null
        const lensModel = tags['Lens Model'] ? tags['Lens Model'].description : null

        return {
          path,
          fileSize: stats.size,
          dimensions,
          created,
          modified,
          cameraModel,
          lensModel
        }
      } catch (error) {
        const { message } = error as { message: string }
        console.error(`Error parsing EXIF for file: ${path}`, message)
        return null
      }
    })
  )

  settledPromises.forEach((settledPromise) => {
    if (settledPromise.status === 'fulfilled' && settledPromise.value) {
      results.push(settledPromise.value)
    }
  })

  return results
}
