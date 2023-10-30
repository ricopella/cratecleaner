import { Scan } from '@prisma/client'
import useMain from '@renderer/context/hooks/useMain'
import useScansList from '@renderer/hooks/useScansList'
import { UPDATE_ACTIVE_TAB } from '@src/constants'
import { ScanConfigurationSchema } from '@src/types'
import { formatDistanceToNow } from 'date-fns'
import { useMemo } from 'react'

const classNames = {
  dropdown: 'dropdown dropdown-top',
  btn: 'btn btn-sm',
  ul: 'dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52  max-h-80 flex-nowrap overflow-y-auto'
}

const SCAN_TYPE = {
  duplicate: 'Duplicate',
  not_crated: 'Not in Crate'
}

const TYPE = {
  audio: 'Audio',
  image: 'Image'
}

const ResultItem = ({
  scan
}: {
  scan: Pick<Scan, 'id' | 'createdAt' | 'status' | 'configuration'>
}): JSX.Element => {
  const { dispatch } = useMain()

  const configuration = useMemo(() => {
    const configurationRes = ScanConfigurationSchema.safeParse(JSON.parse(scan.configuration))

    return configurationRes.success ? configurationRes.data : null
  }, [scan.configuration])

  return (
    <li
      key={scan.id}
      onClick={(): void => {
        dispatch({
          type: 'ADD_NEW_SCAN',
          payload: {
            id: scan.id,
            scan: {
              ...scan,
              status: 'ready',
              createdAt: new Date(),
              updatedAt: new Date(),
              results: { files: {} },
              configuration: configuration ?? {
                directoryPaths: [],
                type: 'audio',
                matchType: 'name',
                includeCrates: false,
                scanType: 'duplicate'
              },
              deletedFiles: []
            }
          }
        })

        dispatch({
          type: UPDATE_ACTIVE_TAB,
          payload: {
            activeTab: scan.id
          }
        })
      }}
    >
      <a className="grid grid-flow-row gap-0">
        <span className="text-md">
          {SCAN_TYPE[configuration?.scanType as keyof typeof SCAN_TYPE]}{' '}
          {TYPE[configuration?.type as keyof typeof TYPE]}
        </span>
        <span className="text-xs text-info-content">
          ({formatDistanceToNow(scan.createdAt, { addSuffix: true })})
        </span>
      </a>
    </li>
  )
}

export default function PreviousResults(): JSX.Element {
  // fetch previous results
  useScansList()
  const { state } = useMain()
  const list = useMemo(() => state.allScans, [state.allScans])

  return (
    <div className={classNames.dropdown}>
      <label
        tabIndex={0}
        className={`${classNames.btn} ${list.length === 0 ? 'btn-disabled' : ''}`}
      >
        Previous Results
      </label>
      <ul tabIndex={0} className={classNames.ul}>
        {list.map((scan) => (
          <ResultItem key={scan.id} scan={scan} />
        ))}
      </ul>
    </div>
  )
}
