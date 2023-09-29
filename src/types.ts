import { CrateSrc, FilesDirectory } from '@prisma/client'
import { CREATE_CRATE_SRC, GET_CRATE_SRCS, GET_FILES_DIRECTORIES } from './constants'

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

export type MainActions = CreateCrateSrcAction | GetCrateSrcs | GetFileDirectories

export interface MainContextProps {
  state: MainState
  dispatch: React.Dispatch<MainActions>
}

export type FileInfo = {
  name: string
  path: string
  type: string
}
