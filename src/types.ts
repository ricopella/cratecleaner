import { CREATE_CRATE_SRC } from './constants'

export type MainState = {
  crateSrcs: string[]
}

export interface CreateCrateSrcAction {
  type: typeof CREATE_CRATE_SRC
  payload: {
    path: string
  }
}

export type MainActions = CreateCrateSrcAction

export interface MainContextProps {
  state: MainState
  dispatch: React.Dispatch<MainActions>
}
