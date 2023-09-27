import { GET_CRATE_SRCS } from '@src/constants'
import { MainActions, MainState } from '@src/types'

export const initialState: MainState = {
  crateSrcs: [],
  directorySrcs: []
}

export function directoryReducer(state: MainState, action: MainActions): MainState {
  switch (action.type) {
    case GET_CRATE_SRCS:
      return { ...state, crateSrcs: action.payload.crateSrcs }
    default:
      return state
  }
}
