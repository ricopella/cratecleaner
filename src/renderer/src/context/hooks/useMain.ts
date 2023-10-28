import { MainContextProps } from '@renderer/actions/types'
import { useContext } from 'react'
import { MainContext } from '../MainContext'

// Custom hook to use the directory state and dispatch
const useMain = (): MainContextProps => {
  const context = useContext(MainContext)
  if (!context) {
    throw new Error('useDirectory must be used within a DirectoryProvider')
  }
  return context
}

export default useMain
