import { ipcMain } from 'electron'
import { concat } from 'ramda'
import {
  ADD_NEW_SCAN,
  DELETE_CRATE_SRC,
  DELETE_FILES,
  GET_CRATE_SRCS,
  GET_DELETED_FILES_COUNT,
  GET_DELETE_FILES_BY_ID,
  GET_FILES_DIRECTORIES,
  GET_SCANS_LIST,
  GET_SCAN_BY_ID,
  REMOVE_DIRECTORIES,
  SCAN_PROGRESS
} from '../../constants'
import {
  createScan,
  deleteFiles,
  getCrateSrcs,
  getDeleteFilesById,
  getDeletedFilesCount,
  getFilesDirectories,
  getScanById,
  getScansList,
  removeCrateSrcs,
  removeDirectories,
  updateScanById
} from '../../db/actions'
import { ScanConfiguration } from '../../types'
import { deleteFiles as deleteFilesUtil } from '../utils'
import { getDuplicates } from './duplicates'
import { getCratesAndFiles, getDuplicatesWithMetadata } from './utils'

export const registerQueryHandler = (): void => {
  ipcMain.handle(GET_CRATE_SRCS, async () => {
    const result = await getCrateSrcs()

    return result
  })

  ipcMain.handle(DELETE_CRATE_SRC, async (_: unknown, id: string) => {
    const result = await removeCrateSrcs(id)

    return result
  })

  ipcMain.handle(GET_FILES_DIRECTORIES, async () => {
    const result = await getFilesDirectories()

    return result
  })

  ipcMain.handle(REMOVE_DIRECTORIES, async (_: unknown, directories: string[]) => {
    const result = await removeDirectories(directories)

    return result
  })

  ipcMain.handle(ADD_NEW_SCAN, async (_: unknown, configuration: ScanConfiguration) => {
    // first create the scan
    const results = await createScan(configuration)

    if (!results.success) {
      return results
    }

    // Start the duplicate scan in a non-blocking manner
    setImmediate(async () => {
      try {
        const scanResults = await Promise.all([
          getDuplicates(configuration),
          configuration.includeCrates ? getCratesAndFiles() : { crates: [], errorMessages: [] }
        ])

        const resultsWithMetadata = await getDuplicatesWithMetadata(scanResults, configuration)
        ipcMain.emit(SCAN_PROGRESS, { progress: 100 })

        await updateScanById(
          results.data.id,
          'completed',
          JSON.stringify({
            files: resultsWithMetadata.size > 0 ? Object.fromEntries(resultsWithMetadata) : {},
            errors: concat(scanResults[0].errors, scanResults[1].errorMessages)
          })
        )
      } catch (error) {
        await updateScanById(results.data.id, 'error', JSON.stringify({ error }))
      }
    })

    return results
  })

  ipcMain.handle(GET_SCAN_BY_ID, async (_: unknown, scanId: string) => {
    const result = await getScanById(scanId)

    return result
  })

  ipcMain.handle(GET_SCANS_LIST, async () => {
    const result = await getScansList()

    return result
  })

  ipcMain.handle(
    DELETE_FILES,
    async (_: unknown, filePaths: string[], scanId: string, deleteId: string) => {
      const res = await deleteFilesUtil(filePaths)
      await deleteFiles(scanId, res.success, res.errors, deleteId)
    }
  )

  ipcMain.handle(GET_DELETE_FILES_BY_ID, async (_: unknown, id: string) => {
    const result = await getDeleteFilesById(id)
    return result
  })

  ipcMain.handle(GET_DELETED_FILES_COUNT, async () => {
    const result = await getDeletedFilesCount()
    if (!result.success) {
      return result
    }

    return {
      success: true,
      data: result.data.reduce((acc, curr) => acc + curr.count, 0)
    }
  })
}
