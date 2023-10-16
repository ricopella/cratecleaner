import { SCAN_PROGRESS } from '@src/constants'
import { useEffect, useState } from 'react'

const { ipcRenderer } = window.electron

function useScanProgress(): number {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onProgressUpdate = (_: unknown, { progress }: { progress: number }): void => {
      setProgress(progress)
    }

    ipcRenderer.on(SCAN_PROGRESS, onProgressUpdate)

    return () => {
      ipcRenderer.removeListener(SCAN_PROGRESS, onProgressUpdate)
    }
  }, [])

  return progress
}

export default useScanProgress
