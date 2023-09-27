import { dialog, ipcMain } from 'electron'
import { OPEN_FILE_DIALOG, SELECT_DIRECTORY } from '../../constants'

export const registerFileDialogHandler = (): void => {
  ipcMain.on(OPEN_FILE_DIALOG, async (event) => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (!result.canceled && result.filePaths.length > 0) {
      event.sender.send(SELECT_DIRECTORY, result.filePaths[0])
    }
  })
}
