import { createCrateSrc, createFilesDirectory, getCrateSrcs } from '@src/db/actions'
import { dialog, ipcMain } from 'electron'
import {
  DIALOG_CRATE_SRC,
  DIALOG_FILES_DIRECTORY,
  GET_CRATE_SRCS,
  NEW_CRATE_SRC,
  NEW_FILES_DIRECTORY
} from '../../constants'

export const registerFileDialogHandler = (): void => {
  ipcMain.on(DIALOG_CRATE_SRC, async (event) => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (!result.canceled && result.filePaths.length > 0) {
      await createCrateSrc(result.filePaths[0])
      // TODO: support multiple files & try/catch
      event.sender.send(NEW_CRATE_SRC, result.filePaths[0])
    }
  })

  ipcMain.on(DIALOG_FILES_DIRECTORY, async (event) => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (!result.canceled && result.filePaths.length > 0) {
      // TODO: support multiple directories & try/catch
      await createFilesDirectory(result.filePaths[0])
      event.sender.send(NEW_FILES_DIRECTORY, result.filePaths[0])
    }
  })

  ipcMain.handle(GET_CRATE_SRCS, async () => {
    const result = await getCrateSrcs()

    return result
  })
}
