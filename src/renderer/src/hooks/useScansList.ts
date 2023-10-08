import { Scan } from '@prisma/client'
import { getScansList } from '@renderer/actions/ipc'
import { useTableContext } from '@renderer/context/TableContext'
import { useEffect, useState } from 'react'

export default function useScansList(): {
  list: Pick<Scan, 'id' | 'createdAt' | 'status'>[]
} {
  const [list, setList] = useState<Pick<Scan, 'id' | 'createdAt' | 'status'>[]>([])
  const { setError } = useTableContext()

  useEffect(() => {
    // TODO: handle new results
    getScansList().then((result) => {
      if (result.success) {
        setList(result.data)
      } else {
        setError(result.error)
      }
    })
  }, [])

  return { list }
}
