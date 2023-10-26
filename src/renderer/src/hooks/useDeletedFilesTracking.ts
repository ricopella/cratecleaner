import { DeletedFiles } from '@prisma/client'
import { getDeletedFilesById } from '@renderer/actions/ipc'
import { useMain } from '@renderer/context/MainContext'
import { transformDeletedFiles } from '@renderer/utils/transformDeletedFiles'
import { ADD_DELETED_FILES_RESULT } from '@src/constants'
import { DatabaseOperationResult } from '@src/types'
import { useQueries, useQueryClient } from '@tanstack/react-query'
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
  const queryClient = useQueryClient()
  const scans = Object.values(state.scans)

  const queries = useQueries({
    queries: scans.map((scan) => ({
      queryKey: ['deletedFiles', scan.trackingDeleteId],
      queryFn: () => (scan.trackingDeleteId ? getDeletedFilesById(scan.trackingDeleteId) : null),
      refetchInterval: 2000, // Refetch every 2 seconds
      onSuccess: (deleteRes: DatabaseOperationResult<DeletedFiles | null>): void => {
        if (deleteRes.success && deleteRes.data) {
          dispatch({
            type: ADD_DELETED_FILES_RESULT,
            payload: {
              scanId: scan.id,
              deletedFiles: transformDeletedFiles(deleteRes.data)
            }
          })
        }
      }
    }))
  })

  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        scans.forEach((scan) => {
          queryClient.removeQueries({
            queryKey: ['deletedFiles', scan.trackingDeleteId]
          })
        })
      },
      3 * 60 * 1000
    ) // Stop refetching after 3 minutes

    return () => {
      clearTimeout(timeoutId)
      scans.forEach((scan) => {
        queryClient.removeQueries({
          queryKey: ['deletedFiles', scan.trackingDeleteId]
        })
      })
    }
  }, [queries])
}

export default useDeletedFilesTracking
