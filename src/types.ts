import { CrateSrc, FilesDirectory, Scan } from '@prisma/client'
import { z } from 'zod'
import {
  ADD_NEW_SCAN,
  CREATE_CRATE_SRC,
  GET_CRATE_SRCS,
  GET_FILES_DIRECTORIES,
  NEW_FILES_DIRECTORY,
  REMOVE_DIRECTORIES,
  REMOVE_SCAN,
  UPDATE_ACTIVE_TAB,
  UPDATE_SCAN_STATUS
} from './constants'

export type DatabaseOperationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export type MainState = {
  crateSrcs: CrateSrc[]
  directorySrcs: FilesDirectory[]
  scans: Record<string, ExtendedScan>
  activeTab: string // DIRECTORIES or uuid if result
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

const duplicateFile = z.object({
  name: z.string(),
  path: z.string(),
  type: z.string()
})

export type DuplicateFile = z.infer<typeof duplicateFile>

const resultsSchema = z.object({
  files: z.record(z.string(), z.array(duplicateFile))
})

export const ScanResultsSchema = z.union([resultsSchema, z.null()])

export type ScanResults = z.infer<typeof resultsSchema>

export type ExtendedScan = Omit<Scan, 'results' | 'configuration'> & {
  results: z.infer<typeof ScanResultsSchema>
  configuration: z.infer<typeof ScanConfigurationSchema>
}

export type ResultsData = {
  id: string
  name: string
  files: DuplicateFile[]
}
