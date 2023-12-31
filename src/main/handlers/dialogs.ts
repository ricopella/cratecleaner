import { dialog, ipcMain } from 'electron'
import {
  DIALOG_CRATE_SRC,
  DIALOG_FILES_DIRECTORY,
  NEW_CRATE_SRC,
  NEW_FILES_DIRECTORY
} from '../../constants'
import { createCrateSrc, createFilesDirectory } from '../../db/actions'

export const registerFileDialogHandler = (): void => {
  ipcMain.on(DIALOG_CRATE_SRC, async (event) => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (!result.canceled && result.filePaths.length > 0) {
      await Promise.all(result.filePaths.map((path) => createCrateSrc(path)))

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
      event.sender.send(NEW_FILES_DIRECTORY, newDirectory)
    }
  })
}
