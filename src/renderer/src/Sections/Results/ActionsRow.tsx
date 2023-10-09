type Props = {
  selectedCount: number
  showPrompt: () => void
  reset: () => void
}
export default function ActionsRow({ selectedCount, reset, showPrompt }: Props): JSX.Element {
  return (
    <div className="grid grid-cols-max-max gap-2">
      <button
        className={`btn btn-warning btn-sm ${selectedCount > 0 ? '' : 'btn-disabled'}`}
        disabled={selectedCount > 0 ? false : true}
        onClick={showPrompt}
      >
        Delete {selectedCount}
      </button>
      <button
        className={`btn btn-neutral btn-sm ${selectedCount > 0 ? '' : 'btn-disabled'}`}
        disabled={selectedCount > 0 ? false : true}
        onClick={reset}
      >
        Reset
      </button>
    </div>
  )
}
