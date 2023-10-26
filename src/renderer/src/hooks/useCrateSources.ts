import { CrateSrc } from '@prisma/client'
import {
  getCrateSrcs,
  listenForNewCrate,
  removeSelectDirectoryListener
} from '@renderer/actions/ipc'
import { DatabaseOperationResult, Status } from '@src/types'
import { QueryObserverResult, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

const useCrateSources = (): {
  status: Status
  crates: CrateSrc[] | null
  refetch: () => Promise<QueryObserverResult<DatabaseOperationResult<CrateSrc[]>, Error>>
} => {
  const {
    data: res,
    status,
    refetch
  } = useQuery<DatabaseOperationResult<CrateSrc[]>, Error>({
    queryKey: ['crateSources'],
    queryFn: getCrateSrcs
  })

  const { data } = res?.success ? res : { data: null }

  useEffect(() => {
    const callback = (): void => {
      refetch()
    }

    listenForNewCrate(callback)

    return () => {
      removeSelectDirectoryListener(callback)
    }
  }, [refetch])

  return {
    crates: data,
    status,
    refetch
  }
}

export default useCrateSources
