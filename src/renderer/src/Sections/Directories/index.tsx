import { TableProvider } from '@renderer/context/TableContext'
import ActionsRow from './ActionsRow'
import ConfigurationPanel from './ConfigurationPanel'
import List from './List'

const classNames = {
  container: 'h-full w-full grid grid-rows-max-1fr-max'
}

function Directories(): JSX.Element {
  return (
    <TableProvider>
      <div className={classNames.container}>
        <ConfigurationPanel />
        <List />
        <ActionsRow />
      </div>
    </TableProvider>
  )
}

export default Directories
