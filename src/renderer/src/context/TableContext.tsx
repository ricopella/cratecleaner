import { TableContextProps } from '@src/types'
import React, { ReactNode, createContext, useContext, useState } from 'react'

const TableContext = createContext<TableContextProps | undefined>(undefined)

interface TableProviderProps {
  children: ReactNode
}

export const TableProvider: React.FC<TableProviderProps> = ({ children }) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  return (
    <TableContext.Provider value={{ rowSelection, setRowSelection, error, setError }}>
      {children}
    </TableContext.Provider>
  )
}

export const useTableContext = (): TableContextProps => {
  const context = useContext(TableContext)
  if (!context) {
    throw new Error('useTableContext must be used within a TableProvider')
  }
  return context
}
