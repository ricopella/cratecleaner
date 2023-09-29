import { CrateSrc, FilesDirectory } from '@prisma/client'
import {
  CREATE_CRATE_SRC,
  GET_CRATE_SRCS,
  GET_FILES_DIRECTORIES,
  NEW_FILES_DIRECTORY
} from './constants'

export type DatabaseOperationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export type MainState = {
  crateSrcs: CrateSrc[]
  directorySrcs: FilesDirectory[]
}

export interface CreateCrateSrcAction {
  type: typeof CREATE_CRATE_SRC
  payload: {
    path: string
  }
}

export interface GetCrateSrcs {
  type: typeof GET_CRATE_SRCS
  payload: {
    crateSrcs: CrateSrc[]
  }
}

interface GetFileDirectories {
  type: typeof GET_FILES_DIRECTORIES
  payload: {
    directorySrcs: FilesDirectory[]
  }
}

interface NewFileDirectory {
  type: typeof NEW_FILES_DIRECTORY
  payload: {
    directorySrc: FilesDirectory
  }
}

export type MainActions =
  | CreateCrateSrcAction
  | GetCrateSrcs
  | GetFileDirectories
  | NewFileDirectory

export interface MainContextProps {
  state: MainState
  dispatch: React.Dispatch<MainActions>
}

export type FileInfo = {
  name: string
  path: string
  type: string
}

export type Status = 'idle' | 'loading' | 'success' | 'error'
