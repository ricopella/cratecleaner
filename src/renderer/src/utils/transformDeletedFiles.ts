import { DeletedFiles } from '@prisma/client'
import { DeletedFilesSchema, deletedFilesSchema } from '@src/types'

export const transformDeletedFiles = (deletedFiles: DeletedFiles): DeletedFilesSchema => {
  const deletedFilesRes = deletedFilesSchema.safeParse({
    ...deletedFiles,
    errors: JSON.parse(deletedFiles.errors),
    success: JSON.parse(deletedFiles.success)
  })

  if (deletedFilesRes.success === false) {
    console.error('Error parsing deleted files', {
      deletedFilesRes
    })

    return {
      ...deletedFiles,
      errors: {},
      success: {}
    }
  }

  return deletedFilesRes.data
}
