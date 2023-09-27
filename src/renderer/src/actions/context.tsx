import { MainContextProps } from '@src/types'
import React, { ReactNode, createContext, useContext, useReducer } from 'react'
import { directoryReducer, initialState } from './reducer'

// Create a context
const MainContext = createContext<MainContextProps | null>(null)

interface MainProviderProps {
  children: ReactNode
}

export const MainProvider: React.FC<MainProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(directoryReducer, initialState)

  return <MainContext.Provider value={{ state, dispatch }}>{children}</MainContext.Provider>
}

// Custom hook to use the directory state and dispatch
export const useDirectory = (): MainContextProps => {
  const context = useContext(MainContext)
  if (!context) {
    throw new Error('useDirectory must be used within a DirectoryProvider')
  }
  return context
}
