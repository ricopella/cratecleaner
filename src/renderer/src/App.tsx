import { MainProvider } from './actions/context'
import CratesList from './components/CratesList'
import DirectoriesList from './components/DirectoriesList'
import Duplicates from './components/Duplicates'

function App(): JSX.Element {
  return (
    <MainProvider>
      <div data-theme="luxury">
        <CratesList />
        <DirectoriesList />
        <Duplicates />
      </div>
    </MainProvider>
  )
}

export default App
