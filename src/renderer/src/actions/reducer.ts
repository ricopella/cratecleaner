import {
  ADD_DELETED_FILES_RESULT,
  ADD_NEW_SCAN,
  ADD_TRACKING_DELETE_ID,
  GET_CRATE_SRCS,
  GET_FILES_DIRECTORIES,
  NEW_FILES_DIRECTORY,
  REMOVE_DIRECTORIES,
  REMOVE_SCAN,
  SET_ERROR_MESSAGE,
  UPDATE_ACTIVE_TAB,
  UPDATE_SCAN_STATUS
} from '@src/constants'

import { DeletedFilesSchema } from '@src/types'
import { assocPath, concat, curry, dissoc, uniq, uniqBy } from 'ramda'
import { MainActions, MainState } from './types'

export const initialState: MainState = {
  activeTab: 'DIRECTORIES',
  crateSrcs: [],
  directorySrcs: [],
  error: null,
  scans: {}
}

export function directoryReducer(state: MainState, action: MainActions): MainState {
  switch (action.type) {
    case GET_CRATE_SRCS:
      return assocPath(['crateSrcs'], action.payload.crateSrcs, state)
    case GET_FILES_DIRECTORIES:
      return assocPath(['directorySrcs'], action.payload.directorySrcs, state)
    case NEW_FILES_DIRECTORY:
      return assocPath(
        ['directorySrcs'],
        uniq(concat(state.directorySrcs, [action.payload.directorySrc])),
        state
      )
    case SET_ERROR_MESSAGE:
      return assocPath(['error'], action.payload.error, state)
    case REMOVE_DIRECTORIES:
      return assocPath(
        ['directorySrcs'],
        state.directorySrcs.filter((directorySrc) => !action.payload.ids.includes(directorySrc.id)),
        state
      )
    case ADD_NEW_SCAN:
      return assocPath(['scans', action.payload.id], action.payload.scan, state)
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
      return assocPath(['activeTab'], action.payload.activeTab, state)
    case REMOVE_SCAN:
      return assocPath(['scans'], dissoc(action.payload.id, state.scans), state)
    case ADD_TRACKING_DELETE_ID:
      return assocPath(
        ['scans', action.payload.scanId, 'trackingDeleteId'],
        action.payload.deleteId,
        state
      )

    case ADD_DELETED_FILES_RESULT: {
      const scanId = action.payload.scanId
      const updatedDeletedFiles = uniqBy(
        (f: DeletedFilesSchema) => f.id,
        concat(state.scans[scanId].deletedFiles, [action.payload.deletedFiles])
      )

      const updateDeletedFiles = curry(assocPath)(['scans', scanId, 'deletedFiles'])
      const updateTrackingDeleteId = curry(assocPath)(['scans', scanId, 'trackingDeleteId'])

      const updatedState: MainState = updateTrackingDeleteId(null)(
        updateDeletedFiles(updatedDeletedFiles)(state)
      )
      return updatedState
    }
    default:
      return state
  }
}
