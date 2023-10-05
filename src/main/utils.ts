import fs from 'node:fs/promises'
import { DeleteResult } from '../types'

export async function deleteFiles(filePaths: string[]): Promise<DeleteResult> {
  const deleteResult: DeleteResult = {
    successCount: 0,
    errors: {},
    success: {}
  }

  for (const filePath of filePaths) {
    try {
      await fs.unlink(filePath)
      deleteResult.successCount++
      deleteResult.success[filePath] = true
    } catch (error) {
      const errorCode = (error as { code: string }).code
      let errorMessage = ''

      switch (errorCode) {
        case 'ENOENT':
          errorMessage = `Error: The file ${filePath} does not exist.`
          break
        case 'EACCES':
          errorMessage = `Error: Permission denied. Cannot delete ${filePath}.`
          break
        case 'EBUSY':
          errorMessage = `Error: The file ${filePath} is in use by another process.`
          break
        case 'EROFS':
          errorMessage = `Error: The file system is read-only. Cannot delete ${filePath}.`
          break
        case 'EISDIR':
          errorMessage = `Error: ${filePath} is a directory. Use fs.rmdir() to delete directories.`
          break
        default:
          errorMessage = `Error: Unable to delete ${filePath}.`
      }

      deleteResult.errors[filePath] = errorMessage
    }
  }

  return deleteResult
}
