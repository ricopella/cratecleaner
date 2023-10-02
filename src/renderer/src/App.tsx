import { SectionTabs } from './components/SectionTabs'
import { MainProvider } from './context/MainContext'

function App(): JSX.Element {
  return (
    <MainProvider>
      <div data-theme="luxury">
        <SectionTabs />
      </div>
    </MainProvider>
  )
}

export default App
