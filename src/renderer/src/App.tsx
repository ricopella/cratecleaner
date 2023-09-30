import { MainProvider } from './actions/context'
import { SectionTabs } from './components/SectionTabs'

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
