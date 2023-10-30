import { Scan } from '@prisma/client'
import { getScansList } from '@renderer/actions/ipc'
import useMain from '@renderer/context/hooks/useMain'
import { DatabaseOperationResult } from '@src/types'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export default function useScansList(): void {
  const { dispatch } = useMain()

  const { data } = useQuery<
    DatabaseOperationResult<Pick<Scan, 'id' | 'createdAt' | 'status' | 'configuration'>[]>
  >({
    queryKey: ['scansList'],
    queryFn: getScansList
  })

  useEffect(() => {
    if (!data?.success && data?.error) {
      dispatch({
        type: 'SET_ERROR_MESSAGE',
        payload: {
          error: data.error
        }
      })
    }

    if (data?.success) {
      dispatch({
        type: 'SET_SCANS_LIST',
        payload: {
          scans: data.data
        }
      })
    }
  }, [data, dispatch])
}
