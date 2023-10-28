import { DeletedFiles } from '@prisma/client'
import { getDeletedFilesById } from '@renderer/actions/ipc'
import { useMain } from '@renderer/context/MainContext'
import { transformDeletedFiles } from '@renderer/utils/transformDeletedFiles'
import { ADD_DELETED_FILES_RESULT } from '@src/constants'
import { ExtendedScan } from '@src/types'
import { useEffect } from 'react'

/**
 * This hook is used to track the status of a scan delete operation by its id.
 * It will poll the backend every 2 seconds to check if the status has changed.
 * If the status has changed, it will update the state.
 * If the status is still pending after 3 minutes, it will stop polling.
 *
 * If a new delete id is added to scans state, this hook will start tracking it.
 */
const useDeletedFilesTracking = ({
  state,
  dispatch
}: {
  state: ReturnType<typeof useMain>['state']
  dispatch: ReturnType<typeof useMain>['dispatch']
}): void => {
  useEffect(() => {
    const intervalIds: NodeJS.Timeout[] = []
    const pollingDuration = 3 * 60 * 1000 // timeout at 3 min

    Object.keys(state.scans).forEach((id) => {
      const scan = state.scans[id]
      const { trackingDeleteId } = scan
      const deletedFiles =
        (scan as ExtendedScan & { deletedFiles: DeletedFiles[] })?.deletedFiles ?? []
      const deletedFilesIds = deletedFiles.map((file) => file.id)

      if (trackingDeleteId && !deletedFilesIds.includes(trackingDeleteId)) {
        const intervalId = setInterval(async () => {
          const deleteRes = await getDeletedFilesById(trackingDeleteId)

          if (deleteRes.success === false) {
            clearInterval(intervalId)
          }

          if (deleteRes.success && deleteRes.data) {
            clearInterval(intervalId)

            dispatch({
              type: ADD_DELETED_FILES_RESULT,
              payload: {
                scanId: id,
                deletedFiles: transformDeletedFiles(deleteRes.data)
              }
            })
          }
        })

        intervalIds.push(intervalId)
      }
    })

    const timeoutId = setTimeout(() => {
      intervalIds.forEach((id) => clearInterval(id))
    }, pollingDuration)

    return () => {
      clearTimeout(timeoutId)

      intervalIds.forEach((id) => clearInterval(id))
    }
  }, [state.scans, dispatch])
}

export default useDeletedFilesTracking
