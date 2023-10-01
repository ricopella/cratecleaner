import {
  ADD_NEW_SCAN,
  GET_CRATE_SRCS,
  GET_FILES_DIRECTORIES,
  GET_SCAN_BY_ID,
  REMOVE_DIRECTORIES
} from '@src/constants'
import {
  createScan,
  getCrateSrcs,
  getFilesDirectories,
  getScanById,
  removeDirectories,
  updateScanById
} from '@src/db/actions'
import { ScanConfiguration } from '@src/types'
import { ipcMain } from 'electron'
import { getDuplicates } from './duplicates'

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

        await updateScanById(
          results.data.id,
          'completed',
          JSON.stringify({
            files: Object.fromEntries(scanResults)
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
}
