export type IPCListenerCallBack<T> = (arg: T) => void

const { ipcRenderer } = window.electron

export const createIpcListener = <T>(
  channel: string,
  callback: IPCListenerCallBack<T>
): (() => void) => {
  const listener = (_: unknown, data: T): void => {
    callback(data)
  }

  ipcRenderer.on(channel, listener)

  return (): void => {
    ipcRenderer.removeListener(channel, listener)
  }
}
