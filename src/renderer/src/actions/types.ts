import { CrateSrc, FilesDirectory } from '@prisma/client'
import {
  ADD_DELETED_FILES_RESULT,
  ADD_NEW_SCAN,
  ADD_TRACKING_DELETE_ID,
  CREATE_CRATE_SRC,
  GET_CRATE_SRCS,
  GET_FILES_DIRECTORIES,
  NEW_FILES_DIRECTORY,
  REMOVE_DIRECTORIES,
  REMOVE_SCAN,
  SET_ERROR_MESSAGE,
  UPDATE_ACTIVE_TAB,
  UPDATE_SCAN_STATUS
} from '@src/constants'
import { DeletedFilesSchema, ExtendedScan } from '@src/types'

export type MainState = {
  activeTab: string // DIRECTORIES or uuid if result
  crateSrcs: CrateSrc[]
  directorySrcs: FilesDirectory[]
  error: string | null
  scans: Record<string, ExtendedScan>
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

interface DeleteFileDirectories {
  type: typeof REMOVE_DIRECTORIES
  payload: {
    ids: string[]
  }
}

interface AddNewScan {
  type: typeof ADD_NEW_SCAN
  payload: {
    id: string
    scan: ExtendedScan
  }
}

interface UpdateScanStatus {
  type: typeof UPDATE_SCAN_STATUS
  payload: ExtendedScan
}

interface UpdateActiveTab {
  type: typeof UPDATE_ACTIVE_TAB
  payload: {
    activeTab: string
  }
}

interface RemoveScan {
  type: typeof REMOVE_SCAN
  payload: {
    id: string
  }
}

interface AddTrackingDeleteId {
  type: typeof ADD_TRACKING_DELETE_ID
  payload: {
    scanId: string
    deleteId: string
  }
}

interface AddDeletedFilesResult {
  type: typeof ADD_DELETED_FILES_RESULT
  payload: {
    scanId: string
    deletedFiles: DeletedFilesSchema
  }
}

interface SetErrorMessage {
  type: typeof SET_ERROR_MESSAGE
  payload: {
    error: string | null
  }
}

export type MainActions =
  | CreateCrateSrcAction
  | GetCrateSrcs
  | GetFileDirectories
  | NewFileDirectory
  | DeleteFileDirectories
  | AddNewScan
  | UpdateScanStatus
  | UpdateActiveTab
  | RemoveScan
  | AddTrackingDeleteId
  | AddDeletedFilesResult
  | SetErrorMessage

export interface MainContextProps {
  state: MainState
  dispatch: React.Dispatch<MainActions>
}
