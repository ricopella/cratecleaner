import useScanProgress from '@renderer/hooks/useScanProgress'

export default function ScanProgress(): JSX.Element {
  const progress = useScanProgress()

  return <progress className="progress w-56" value={progress} max="100"></progress>
}
