import { useMain } from '@renderer/context/MainContext'
import useScansList from '@renderer/hooks/useScansList'
import { UPDATE_ACTIVE_TAB } from '@src/constants'
import { format } from 'date-fns'

const classNames = {
  dropdown: 'dropdown dropdown-top',
  btn: 'btn btn-sm',
  ul: 'dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
}

export default function PreviousResults(): JSX.Element {
  // fetch previous results
  const { list } = useScansList()
  const { dispatch } = useMain()

  return (
    <div className={classNames.dropdown}>
      <label tabIndex={0} className={classNames.btn}>
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
                  // TODO: fix type
                  scan: {
                    ...scan,
                    status: 'pending' // to have polling query for finished scan TODO: consider changing logic
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
