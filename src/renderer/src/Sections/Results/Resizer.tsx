import { Header } from '@tanstack/react-table'

export default function Resizer<T, U>({ header }: { header: Header<T, U> }): JSX.Element {
  return (
    <div
      className={`absolute right-0 top-0 h-full w-1 rounded-sm bg-opacity-50 cursor-col-resize select-none opacity-0 hover:opacity-100 group-hover:opacity-100 ${
        header.column.getIsResizing() ? 'bg-secondary' : 'bg-black'
      }`}
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
    />
  )
}
