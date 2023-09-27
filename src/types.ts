import { CrateSrc, FilesDirectory } from '@prisma/client'
import { CREATE_CRATE_SRC, GET_CRATE_SRCS } from './constants'

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

export type MainActions = CreateCrateSrcAction | GetCrateSrcs

export interface MainContextProps {
  state: MainState
  dispatch: React.Dispatch<MainActions>
}
