import { OPEN_FILE_DIALOG, SELECT_DIRECTORY } from '../../constants'
import { MainProvider } from './actions/context'

const { ipcRenderer } = window.electron

function App(): JSX.Element {
  const selectDirectory = (): void => {
    ipcRenderer.send(OPEN_FILE_DIALOG)
  }

  ipcRenderer.on(SELECT_DIRECTORY, (_, path: string) => {
    console.log(`You selected: ${path}`)
  })

  return (
    <MainProvider>
      <div className="container">
        <h1>Coming soon</h1>
        <button onClick={selectDirectory}>Set Crate Path</button>
      </div>
    </MainProvider>
  )
}

export default App
