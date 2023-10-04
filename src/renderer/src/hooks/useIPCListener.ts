import { IPCListenerCallBack, createIpcListener } from '@renderer/utils/createIpcListener'
import { useEffect } from 'react'

export const useIpcListener = <T>(channel: string, callback: IPCListenerCallBack<T>): void => {
  useEffect(() => {
    console.log('Setting up IPC listener for channel:', channel)

    const removeListener = createIpcListener(channel, callback)

    return () => {
      console.log('Removing IPC listener for channel:', channel)

      removeListener()
    }
  }, [channel])
}
