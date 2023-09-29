import { GET_CRATE_SRCS, GET_FILES_DIRECTORIES, NEW_FILES_DIRECTORY } from '@src/constants'
import { MainActions, MainState } from '@src/types'

export const initialState: MainState = {
  crateSrcs: [],
  directorySrcs: []
}

export function directoryReducer(state: MainState, action: MainActions): MainState {
  switch (action.type) {
    case GET_CRATE_SRCS:
      return { ...state, crateSrcs: action.payload.crateSrcs }
    case GET_FILES_DIRECTORIES:
      return {
        ...state,
        directorySrcs: action.payload.directorySrcs
      }
    case NEW_FILES_DIRECTORY:
      return {
        ...state,
        directorySrcs: [...state.directorySrcs, action.payload.directorySrc]
      }
    default:
      return state
  }
}
