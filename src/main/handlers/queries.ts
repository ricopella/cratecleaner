import { ipcMain } from 'electron'
import {
  ADD_NEW_SCAN,
  DELETE_FILES,
  GET_CRATE_SRCS,
  GET_DELETE_FILES_BY_ID,
  GET_FILES_DIRECTORIES,
  GET_SCANS_LIST,
  GET_SCAN_BY_ID,
  REMOVE_DIRECTORIES
} from '../../constants'
import {
  createScan,
  deleteFiles,
  getCrateSrcs,
  getDeleteFilesById,
  getFilesDirectories,
  getScanById,
  getScansList,
  removeDirectories,
  updateScanById
} from '../../db/actions'
import { ScanConfiguration } from '../../types'
import { deleteFiles as deleteFilesUtil } from '../utils'
import { getDuplicates } from './duplicates'
import { getDuplicatesWithMetadata } from './utils'

export const registerQueryHandler = (): void => {
  ipcMain.handle(GET_CRATE_SRCS, async () => {
    const result = await getCrateSrcs()

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
        const scanResults = await getDuplicates(configuration.directoryPaths)
        const resultsWithMetadata = await getDuplicatesWithMetadata(scanResults)

        await updateScanById(
          results.data.id,
          'completed',
          JSON.stringify({
            files: Object.fromEntries(resultsWithMetadata)
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
}
