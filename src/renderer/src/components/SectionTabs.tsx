import Directories from '@renderer/Sections/Directories'
import Results from '@renderer/Sections/Results'
import { useMain } from '@renderer/context/MainContext'
import { keys } from 'ramda'
import { useState } from 'react'

const classNames = {
  container: 'p-4 h-screen flex flex-col',
  tabs: 'tabs',
  tab: 'tab tab-lifted',
  contentContainer: 'bg-base-300 h-full w-full p-4 rounded'
}

export function SectionTabs(): JSX.Element {
  // Initialize activeTab to 'DIRECTORIES'
  const [activeTab, setActiveTab] = useState<string>('DIRECTORIES')
  const { state } = useMain()

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
  }

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
            {/* TODO: add remove tab button */}
            Results
          </a>
        ))}
      </div>
      <div className={classNames.contentContainer}>
        {activeTab === 'DIRECTORIES' ? <Directories /> : <Results id={activeTab} />}
      </div>
    </div>
  )
}
