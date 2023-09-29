import { GET_CRATE_SRCS, GET_DUPLICATES, GET_FILES_DIRECTORIES } from '@src/constants'
import { getCrateSrcs, getFilesDirectories } from '@src/db/actions'
import { ipcMain } from 'electron'
import { getDuplicates } from './duplicates'

export const registerQueryHandler = (): void => {
  ipcMain.handle(GET_CRATE_SRCS, async () => {
    const result = await getCrateSrcs()

    return result
  })

  ipcMain.handle(GET_FILES_DIRECTORIES, async () => {
    const result = await getFilesDirectories()

    return result
  })

  ipcMain.handle(GET_DUPLICATES, async () => {
    const getFilesDirectoriesResult = await getFilesDirectories()

    if (!getFilesDirectoriesResult.success) {
      return getFilesDirectoriesResult
    }

    const directories = getFilesDirectoriesResult.data.map((directory) => directory.path)
    const result = await getDuplicates(directories)

    return result
  })
}
