import { CrateSrc } from '@prisma/client'
import {
  DIALOG_CRATE_SRC,
  DIALOG_FILES_DIRECTORY,
  GET_CRATE_SRCS,
  NEW_CRATE_SRC,
  NEW_FILES_DIRECTORY
} from '@src/constants'
import { DatabaseOperationResult } from '@src/types'

const { ipcRenderer } = window.electron

export const openCrateDialog = (): void => {
  ipcRenderer.send(DIALOG_CRATE_SRC)
}

export const openFilesDirectoryDialog = (): void => {
  ipcRenderer.send(DIALOG_FILES_DIRECTORY)
}

export type CallBack = (path: string) => void

export const listenForSelectDirectory = (callback: CallBack): void => {
  ipcRenderer.on(NEW_CRATE_SRC, (_: unknown, path: string) => {
    callback(path)
  })
}

export const removeSelectDirectoryListener = (callback: CallBack): void => {
  ipcRenderer.removeListener(NEW_CRATE_SRC, callback)
}

export const listenForSelectFilesDirectory = (callback: CallBack): void => {
  ipcRenderer.on(NEW_FILES_DIRECTORY, (_: unknown, path: string) => {
    callback(path)
  })
}

export const removeSelectFilesDirectoryListener = (callback: CallBack): void => {
  ipcRenderer.removeListener(NEW_FILES_DIRECTORY, callback)
}

export const getCrateSrcs = (): Promise<DatabaseOperationResult<CrateSrc[]>> => {
  // TODO: use async/await
  return ipcRenderer
    .invoke(GET_CRATE_SRCS)
    .then((result: DatabaseOperationResult<CrateSrc[]>) => {
      return result
    })
    .catch((error) => {
      console.error({ error })
    })
}
