import { createCrateSrc, createFilesDirectory } from '@src/db/actions'
import { dialog, ipcMain } from 'electron'
import {
  DIALOG_CRATE_SRC,
  DIALOG_FILES_DIRECTORY,
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
      // TODO: support multiple files
      event.sender.send(NEW_CRATE_SRC, result.filePaths[0])
    }
  })

  ipcMain.on(DIALOG_FILES_DIRECTORY, async (event) => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (!result.canceled && result.filePaths.length > 0) {
      // TODO: support multiple directories
      const newDirectory = await createFilesDirectory(result.filePaths[0])
      console.log({ newDirectory })
      event.sender.send(NEW_FILES_DIRECTORY, newDirectory)
    }
  })
}
