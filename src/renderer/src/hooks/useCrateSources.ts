import { CrateSrc } from '@prisma/client'
import { getCrateSrcs, listenForNewCrate } from '@renderer/actions/ipc'
import { Status } from '@src/types'
import { useEffect } from 'react'
import useStatus from './useStatus'

const useCrateSources = (): {
  status: Status
  crates: CrateSrc[] | null
  refetch: () => Promise<void>
} => {
  const { status, loading, handleResponse, data } = useStatus<CrateSrc[]>()

  useEffect(() => {
    listenForNewCrate(() => {
      fetchData()
    })
  })

  const fetchData = async (): Promise<void> => {
    loading()

    const response = await getCrateSrcs()

    handleResponse(response)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    crates: data,
    status,
    refetch: fetchData
  }
}

export default useCrateSources
