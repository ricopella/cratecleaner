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

export type Status = 'idle' | 'pending' | 'success' | 'error'

export const ScanConfigurationSchema = z.object({
  directoryPaths: z.array(z.string()),
  type: z.enum(['audio', 'image']),
  includeCrates: z.boolean(),
  matchType: z.enum(['contents', 'name', 'size']),
  scanType: z.enum(['duplicate', 'not_crated'])
})

export type ScanConfiguration = z.infer<typeof ScanConfigurationSchema>

const audioFileMetadata = z.object({
  album: z.string().nullish(),
  artist: z.string().nullish(),
  genre: z.array(z.string()).nullish(),
  title: z.string().nullish(),
  comment: z.array(z.string()).nullish(),
  bpm: z.number().nullish()
})

const imageFileMetadata = z.object({
  path: z.string(),
  fileSize: z.number(),
  dimensions: z.object({
    width: z.number().nullish(),
    height: z.number().nullish()
  }),
  created: z.string().nullish(),
  modified: z.string().nullish(),
  cameraModel: z.string().nullish(),
  lensModel: z.string().nullish()
})

const fileMetadata = z.union([audioFileMetadata, imageFileMetadata])

const duplicateFile = z.object({
  name: z.string(),
  path: z.string(),
  type: z.string(),
  metadata: fileMetadata.nullish(),
  crates: z.array(z.string())
})

const duplicateAudioFile = z.object({
  name: z.string(),
  path: z.string(),
  type: z.string(),
  metadata: audioFileMetadata.nullish(),
  crates: z.array(z.string())
})

const duplicateImageFile = z.object({
  name: z.string(),
  path: z.string(),
  type: z.string(),
  metadata: imageFileMetadata.nullish(),
  crates: z.array(z.string())
})

const notCrateFile = z.object({
  ...audioFileMetadata.shape,
  name: z.string(),
  path: z.string(),
  type: z.string()
})

export type DuplicateFile = z.infer<typeof duplicateFile>

export type NotCrateFile = z.infer<typeof notCrateFile>

const resultsSchema = z.object({
  files: z.record(z.string(), z.array(duplicateAudioFile)),
  errors: z.array(z.string()).optional()
})

const resultsImageSchema = z.object({
  files: z.record(z.string(), z.array(duplicateImageFile)),
  errors: z.array(z.string()).optional()
})

export const ScanResultsSchema = z.union([resultsSchema, z.null()])
export const ScanResultsSchemaWithAudio = z.union([resultsSchema, z.null()])
export const ScanResultsSchemaWithImage = z.union([resultsImageSchema, z.null()])

export type ScanResults = z.infer<typeof resultsSchema>

export type ExtendedScan = Omit<Scan, 'results' | 'configuration'> & {
  results: z.infer<typeof ScanResultsSchema>
  configuration: z.infer<typeof ScanConfigurationSchema>
  trackingDeleteId?: string | null
  deletedFiles: DeletedFilesSchema[]
}

export type DuplicateData = {
  resultType: 'duplicate'
  id: string
  name: string
  files: DuplicateFile[]
}

export type NotCratedData = {
  resultType: 'not_crated'
  id: string
  name: string
} & NotCrateFile

export type ResultsData = DuplicateData | NotCratedData

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

export type CommonValue = string | number | string[] | null | undefined
