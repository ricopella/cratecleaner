import { IPCListenerCallBack, createIpcListener } from '@renderer/utils/createIpcListener'
import { useEffect } from 'react'

export const useIpcListener = <T>(channel: string, callback: IPCListenerCallBack<T>): void => {
  useEffect(() => {
    const removeListener = createIpcListener(channel, callback)

    return () => {
      removeListener()
    }
  }, [channel, callback])
}
