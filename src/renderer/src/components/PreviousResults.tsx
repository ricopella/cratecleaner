import { useMain } from '@renderer/context/MainContext'
import useScansList from '@renderer/hooks/useScansList'
import { UPDATE_ACTIVE_TAB } from '@src/constants'
import { format } from 'date-fns'
import { useMemo } from 'react'

const classNames = {
  dropdown: 'dropdown dropdown-top',
  btn: 'btn btn-sm',
  ul: 'dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52  max-h-80 flex-nowrap overflow-y-auto'
}

export default function PreviousResults(): JSX.Element {
  // fetch previous results
  useScansList()
  const { state, dispatch } = useMain()
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
          <li
            key={scan.id}
            onClick={(): void => {
              dispatch({
                type: 'ADD_NEW_SCAN',
                payload: {
                  id: scan.id,
                  scan: {
                    ...scan,
                    status: 'pending', // TODO: consider adding anew status just for getting completed ones - if retreived, and status is still pending. should not poll. Will avoid bug of a never ended scan
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    results: { files: {} },
                    configuration: { directoryPaths: [] },
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
            <a>{format(new Date(scan.createdAt), 'MMM dd, yy h:mma')}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
