import { CrateSrc, FilesDirectory, Scan } from '@prisma/client'
import { z } from 'zod'
import {
  ADD_NEW_SCAN,
  CREATE_CRATE_SRC,
  GET_CRATE_SRCS,
  GET_FILES_DIRECTORIES,
  NEW_FILES_DIRECTORY,
  REMOVE_DIRECTORIES,
  UPDATE_SCAN_STATUS
} from './constants'

export type DatabaseOperationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export type MainState = {
  crateSrcs: CrateSrc[]
  directorySrcs: FilesDirectory[]
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

export type MainActions =
  | CreateCrateSrcAction
  | GetCrateSrcs
  | GetFileDirectories
  | NewFileDirectory
  | DeleteFileDirectories
  | AddNewScan
  | UpdateScanStatus

export interface MainContextProps {
  state: MainState
  dispatch: React.Dispatch<MainActions>
}

export interface TableContextProps {
  rowSelection: Record<string, boolean>
  setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  error: string | null
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

export type FileInfo = {
  name: string
  path: string
  type: string
}

export type Status = 'idle' | 'loading' | 'success' | 'error'

export const ScanConfigurationSchema = z.object({
  directoryPaths: z.array(z.string())
})

export type ScanConfiguration = z.infer<typeof ScanConfigurationSchema>

export const ScanResultsSchema = z.union([
  z.object({
    files: z.record(
      z.string(),
      z.array(
        z.object({
          name: z.string(),
          path: z.string(),
          type: z.string()
        })
      )
    )
  }),
  z.null()
])

export type ExtendedScan = Omit<Scan, 'results' | 'configuration'> & {
  results: z.infer<typeof ScanResultsSchema>
  configuration: z.infer<typeof ScanConfigurationSchema>
}
