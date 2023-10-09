import Directories from '@renderer/Sections/Directories'
import { useMain } from '@renderer/context/MainContext'
import { REMOVE_SCAN, UPDATE_ACTIVE_TAB } from '@src/constants'
import { keys } from 'ramda'
import { Suspense, lazy, memo, useMemo } from 'react'
import Loader from './Loader'

const LazyResults = lazy(() => import('@renderer/Sections/Results'))

const classNames = {
  container: 'h-screen p-4 grid grid-rows-max-1fr',
  tabs: 'tabs',
  tab: 'tab tab-lifted',
  contentContainer: 'bg-base-300 h-full w-full rounded-t-none rounded-b overflow-hidden p-4'
}

function SectionTabs(): JSX.Element {
  const { state, dispatch } = useMain()

  const handleTabClick = (tabId: string): void => {
    dispatch({
      type: UPDATE_ACTIVE_TAB,
      payload: {
        activeTab: tabId
      }
    })
  }

  const handleRemoveTab = (tabId: string): void => {
    dispatch({
      type: UPDATE_ACTIVE_TAB,
      payload: {
        activeTab: 'DIRECTORIES'
      }
    })

    dispatch({
      type: REMOVE_SCAN,
      payload: {
        id: tabId
      }
    })
  }

  const activeTab = useMemo(() => state.activeTab, [state.activeTab])

  return (
    <div className={classNames.container}>
      <div className={classNames.tabs}>
        <a
          className={`${classNames.tab} ${activeTab === 'DIRECTORIES' ? 'tab-active' : ''}`}
          onClick={(): void => handleTabClick('DIRECTORIES')}
        >
          Directories
        </a>
        {keys(state.scans).map((scanId) => (
          <a
            key={scanId}
            className={`${classNames.tab} ${activeTab === scanId ? 'tab-active' : ''}`}
            onClick={(): void => handleTabClick(scanId)}
          >
            <button
              onClick={(e): void => {
                e.preventDefault()
                e.stopPropagation()

                handleRemoveTab(scanId)
              }}
              className="mr-2"
            >
              x
            </button>
            Results
          </a>
        ))}
      </div>
      <Suspense
        fallback={
          <div className={`fixed inset-0 flex items-center justify-center`}>
            <Loader />
          </div>
        }
      >
        <div className={classNames.contentContainer}>
          {activeTab === 'DIRECTORIES' ? <Directories /> : <LazyResults id={activeTab} />}
        </div>
      </Suspense>
    </div>
  )
}

export default memo(SectionTabs)
