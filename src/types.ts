import { Scan } from '@prisma/client'
import { ExpandedState, VisibilityState } from '@tanstack/react-table'
import { z } from 'zod'
import { Metadata } from './main/handlers/audioMetadata'

export type DatabaseOperationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export interface TableContextProps {
  expanded: ExpandedState
  columnVisibility: VisibilityState
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>
  filter: string
  rowSelection: Record<string, boolean>
  setExpanded: React.Dispatch<React.SetStateAction<ExpandedState>>
  setFilter: React.Dispatch<React.SetStateAction<string>>
  setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}

export type FileInfo = {
  name: string
  path: string
  type: string
}

export type FileWithMetadata = FileInfo & {
  metadata: Metadata | null
  crates: string[]
}

export type Status = 'idle' | 'loading' | 'success' | 'error'

export const ScanConfigurationSchema = z.object({
  directoryPaths: z.array(z.string()),
  type: z.enum(['audio', 'image']),
  includeCrates: z.boolean(),
  matchType: z.enum(['contents', 'name', 'size'])
})

export type ScanConfiguration = z.infer<typeof ScanConfigurationSchema>

const fileMetadata = z.object({
  album: z.string().nullish(),
  artist: z.string().nullish(),
  genre: z.array(z.string()).nullish(),
  title: z.string().nullish(),
  comment: z.array(z.string()).nullish(),
  bpm: z.number().nullish()
})

const duplicateFile = z.object({
  name: z.string(),
  path: z.string(),
  type: z.string(),
  metadata: fileMetadata.nullish(),
  crates: z.array(z.string())
})

export type DuplicateFile = z.infer<typeof duplicateFile>

const resultsSchema = z.object({
  files: z.record(z.string(), z.array(duplicateFile)),
  errors: z.array(z.string()).optional()
})

export const ScanResultsSchema = z.union([resultsSchema, z.null()])

export type ScanResults = z.infer<typeof resultsSchema>

export type ExtendedScan = Omit<Scan, 'results' | 'configuration'> & {
  results: z.infer<typeof ScanResultsSchema>
  configuration: z.infer<typeof ScanConfigurationSchema>
  trackingDeleteId?: string | null
  deletedFiles: DeletedFilesSchema[]
}

export type ResultsData = {
  id: string
  name: string
  files: DuplicateFile[]
}

export const deletedFilesSchema = z.object({
  id: z.string(),
  count: z.number(),
  status: z.string(),
  errors: z.record(z.string(), z.string()),
  success: z.record(z.string(), z.boolean()),
  scanId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type DeletedFilesSchema = z.infer<typeof deletedFilesSchema>

export type DeleteResult = {
  errors: Record<string, string> // filePath: errorMessage
  success: Record<string, boolean> // filePath: true
}

export type SeratoFolders = {
  [key: string]: string
}

export type CrateFile = {
  filepath: string
  subcrate: Subcrate
}

export type CrateSong = {
  name: string
  path: string
}

export type Subcrate = {
  name: string
  songs: CrateSong[]
}
