import {
  ADD_DELETED_FILES_RESULT,
  ADD_NEW_SCAN,
  ADD_SCAN_TO_ALL_SCANS,
  ADD_TRACKING_DELETE_ID,
  GET_CRATE_SRCS,
  GET_FILES_DIRECTORIES,
  NEW_FILES_DIRECTORY,
  REMOVE_DIRECTORIES,
  REMOVE_SCAN,
  SET_ERROR_MESSAGE,
  SET_SCANS_LIST,
  UPDATE_ACTIVE_TAB,
  UPDATE_SCAN_STATUS
} from '@src/constants'

import { DeletedFilesSchema } from '@src/types'
import { assocPath, concat, curry, dissoc, evolve, uniq, uniqBy } from 'ramda'
import { AllScan, MainActions, MainState } from './types'

export const initialState: MainState = {
  activeTab: 'DIRECTORIES',
  allScans: [],
  crateSrcs: [],
  directorySrcs: [],
  error: null,
  scans: {},
  scanConfiguration: {
    type: 'audio',
    includeCrates: true,
    matchType: 'name',
    scanType: 'duplicate'
  }
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
    case UPDATE_ACTIVE_TAB: {
      const transformations = {
        activeTab: () => action.payload.activeTab,
        error: () => null
      }
      return evolve(transformations, state)
    }
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
    case SET_SCANS_LIST:
      return assocPath(['allScans'], action.payload.scans, state)
    case ADD_SCAN_TO_ALL_SCANS:
      return assocPath(
        ['allScans'],
        uniqBy((s: AllScan) => s.id, concat(state.allScans, [action.payload.scan])),
        state
      )
    case 'UPDATE_SCAN_CONFIGURATION_TYPE':
      return assocPath(['scanConfiguration', 'type'], action.payload.type, state)
    case 'UPDATE_SCAN_CONFIGURATION_MATCH_TYPE':
      return assocPath(['scanConfiguration', 'matchType'], action.payload.matchType, state)
    case 'UPDATE_SCAN_CONFIGURATION_INCLUDE_CRATES':
      return assocPath(['scanConfiguration', 'includeCrates'], action.payload.includeCrates, state)
    case 'UPDATE_SCAN_CONFIGURATION_SCAN_TYPE':
      return assocPath(['scanConfiguration', 'scanType'], action.payload.scanType, state)
    default:
      return state
  }
}
