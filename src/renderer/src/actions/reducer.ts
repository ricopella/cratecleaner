import {
  ADD_NEW_SCAN,
  GET_CRATE_SRCS,
  GET_FILES_DIRECTORIES,
  NEW_FILES_DIRECTORY,
  REMOVE_DIRECTORIES,
  REMOVE_SCAN,
  UPDATE_ACTIVE_TAB,
  UPDATE_SCAN_STATUS
} from '@src/constants'
import { MainActions, MainState } from '@src/types'
import { dissoc } from 'ramda'

export const initialState: MainState = {
  activeTab: 'DIRECTORIES',
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
    case UPDATE_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload.activeTab
      }
    case REMOVE_SCAN:
      return {
        ...state,
        scans: dissoc(action.payload.id, state.scans)
      }
    default:
      return state
  }
}
