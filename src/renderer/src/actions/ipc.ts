import { CrateSrc, FilesDirectory, Scan } from '@prisma/client'
import {
  ADD_NEW_SCAN,
  DIALOG_CRATE_SRC,
  DIALOG_FILES_DIRECTORY,
  GET_CRATE_SRCS,
  GET_DUPLICATES,
  GET_FILES_DIRECTORIES,
  GET_SCAN_BY_ID,
  NEW_CRATE_SRC,
  REMOVE_DIRECTORIES
} from '@src/constants'
import { DatabaseOperationResult, ScanConfiguration } from '@src/types'

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

type IPCArgs<T> = T extends undefined ? [] : [T]

async function invokeIPC<T, A = undefined>(
  channel: string,
  ...args: IPCArgs<A>
): Promise<DatabaseOperationResult<T>> {
  try {
    const result = await ipcRenderer.invoke(channel, ...args)
    return result
  } catch (error) {
    console.error({ error })
    return { success: false, error: (error as { message: string }).message }
  }
}

export const getCrateSrcs = (): Promise<DatabaseOperationResult<CrateSrc[]>> => {
  return invokeIPC<CrateSrc[]>(GET_CRATE_SRCS)
}

export const getFilesDirectories = (): Promise<DatabaseOperationResult<FilesDirectory[]>> => {
  return invokeIPC<FilesDirectory[]>(GET_FILES_DIRECTORIES)
}

export const getDuplicates = (): Promise<DatabaseOperationResult<string[]>> => {
  return invokeIPC<string[]>(GET_DUPLICATES)
}

export const removeDirectories = (
  directories: string[]
): Promise<DatabaseOperationResult<boolean>> => {
  return invokeIPC<boolean, string[]>(REMOVE_DIRECTORIES, directories)
}

export const fetchScanStatusById = (id: string): Promise<DatabaseOperationResult<Scan>> => {
  return invokeIPC<Scan, string>(GET_SCAN_BY_ID, id)
}

export const insertScan = (
  configuration: ScanConfiguration
): Promise<DatabaseOperationResult<Scan>> => {
  return invokeIPC<Scan, ScanConfiguration>(ADD_NEW_SCAN, configuration)
}
