import { MainActions, MainState } from '@src/types'

export const initialState = {
  crateSrcs: []
}

export function directoryReducer(state: MainState, action: MainActions): MainState {
  switch (action.type) {
    // case CREATE_DIRECTORY:
    //   // action.payload.path is typed here
    //   return { ...state /* ... */ }
    // case constants.UPDATE_DIRECTORY:
    //   // action.payload.id and action.payload.newPath are typed here
    //   return { ...state /* ... */ }
    default:
      return state
  }
}
