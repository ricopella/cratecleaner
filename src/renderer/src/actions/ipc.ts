import { CrateSrc, FilesDirectory } from '@prisma/client'
import {
  DIALOG_CRATE_SRC,
  DIALOG_FILES_DIRECTORY,
  GET_CRATE_SRCS,
  GET_DUPLICATES,
  GET_FILES_DIRECTORIES,
  NEW_CRATE_SRC
} from '@src/constants'
import { DatabaseOperationResult } from '@src/types'

const { ipcRenderer } = window.electron

export const openCrateDialog = (): void => {
  ipcRenderer.send(DIALOG_CRATE_SRC)
}

export const openFilesDirectoryDialog = (): void => {
  ipcRenderer.send(DIALOG_FILES_DIRECTORY)
}

export type CallBack<T> = (arg: T) => void

export const listenForSelectDirectory = (callback: CallBack<string>): void => {
  ipcRenderer.on(NEW_CRATE_SRC, (_: unknown, path: string) => {
    callback(path)
  })
}

export const removeSelectDirectoryListener = (callback: CallBack<string>): void => {
  ipcRenderer.removeListener(NEW_CRATE_SRC, callback)
}

export const getCrateSrcs = async (): Promise<DatabaseOperationResult<CrateSrc[]>> => {
  try {
    const result = await ipcRenderer.invoke(GET_CRATE_SRCS)
    return result
  } catch (error) {
    console.error({ error })
    return { success: false, error: (error as { message: string }).message }
  }
}

export const getFilesDirectories = async (): Promise<DatabaseOperationResult<FilesDirectory[]>> => {
  try {
    const result = await ipcRenderer.invoke(GET_FILES_DIRECTORIES)
    return result
  } catch (error) {
    console.error({ error })
    return { success: false, error: (error as { message: string }).message }
  }
}

export const getDuplicates = async (): Promise<DatabaseOperationResult<string[]>> => {
  try {
    const result = await ipcRenderer.invoke(GET_DUPLICATES)
    return result
  } catch (error) {
    console.error({ error })
    return { success: false, error: (error as { message: string }).message }
  }
}
