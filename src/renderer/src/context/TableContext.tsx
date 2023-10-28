import { TableContextProps } from '@src/types'
import { ExpandedState, VisibilityState } from '@tanstack/react-table'
import React, { ReactNode, createContext, useState } from 'react'

export const TableContext = createContext<TableContextProps | undefined>(undefined)

interface TableProviderProps {
  children: ReactNode
}

export const TableProvider: React.FC<TableProviderProps> = ({ children }) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  return (
    <TableContext.Provider
      value={{
        filter: globalFilter,
        setFilter: setGlobalFilter,
        rowSelection,
        setRowSelection,
        expanded,
        setExpanded,
        columnVisibility,
        setColumnVisibility
      }}
    >
      {children}
    </TableContext.Provider>
  )
}
