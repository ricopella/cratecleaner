import Directories from '@renderer/Sections/Directories'
import Results from '@renderer/Sections/Results'
import { useState } from 'react'

const classNames = {
  container: 'p-4 h-screen flex flex-col',
  tabs: 'tabs',
  tab: 'tab tab-lifted',
  contentContainer: 'bg-base-300 h-full w-full p-4 rounded'
}

export function SectionTabs(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'DIRECTORIES' | 'RESULTS'>('DIRECTORIES')

  return (
    <div className={classNames.container}>
      <div className={classNames.tabs}>
        <a
          className={`${classNames.tab} ${activeTab === 'DIRECTORIES' ? 'tab-active' : ''}`}
          onClick={(): void => setActiveTab('DIRECTORIES')}
        >
          Directories
        </a>
        <a
          className={`${classNames.tab} ${activeTab === 'RESULTS' ? 'tab-active' : ''}`}
          onClick={(): void => setActiveTab('RESULTS')}
        >
          Results
        </a>
      </div>
      <div className={classNames.contentContainer}>
        {activeTab === 'DIRECTORIES' ? <Directories /> : <Results />}
      </div>
    </div>
  )
}
