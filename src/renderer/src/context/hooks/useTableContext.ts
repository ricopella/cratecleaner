import { TableContextProps } from '@src/types'
import { useContext } from 'react'
import { TableContext } from '../TableContext'

const useTableContext = (): TableContextProps => {
  const context = useContext(TableContext)
  if (!context) {
    throw new Error('useTableContext must be used within a TableProvider')
  }
  return context
}

export default useTableContext
