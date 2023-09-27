import { MainProvider } from './actions/context'
import { openFilesDirectoryDialog } from './actions/ipc'
import CratesList from './components/CratesList'

function App(): JSX.Element {
  return (
    <MainProvider>
      <div className="container">
        <h1>Coming soon</h1>
        <CratesList />
        <button onClick={openFilesDirectoryDialog}>Set File Folder</button>
      </div>
    </MainProvider>
  )
}

export default App
