import {
  ADD_NEW_SCAN,
  GET_CRATE_SRCS,
  GET_FILES_DIRECTORIES,
  NEW_FILES_DIRECTORY,
  REMOVE_DIRECTORIES,
  UPDATE_SCAN_STATUS
} from '@src/constants'
import { MainActions, MainState } from '@src/types'

export const initialState: MainState = {
  crateSrcs: [],
  directorySrcs: [],
  scans: {}
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
    case REMOVE_DIRECTORIES:
      return {
        ...state,
        directorySrcs: state.directorySrcs.filter(
          (directorySrc) => !action.payload.ids.includes(directorySrc.id)
        )
      }
    case ADD_NEW_SCAN:
      return {
        ...state,
        scans: {
          ...state.scans,
          [action.payload.id]: action.payload.scan
        }
      }
    case UPDATE_SCAN_STATUS: {
      return {
        ...state,
        scans: {
          ...state.scans,
          [action.payload.id]: {
            ...state.scans[action.payload.id],
            ...action.payload
          }
        }
      }
    }

    default:
      return state
  }
}
