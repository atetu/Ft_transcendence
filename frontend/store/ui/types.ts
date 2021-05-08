import { Store, ActionContext, MutationTree } from 'vuex'

import { RootState } from '../types'

export interface UIState {
  drawer: boolean
}

export type UIActionContext = ActionContext<UIState, RootState>
export type UIStore = Store<RootState>

export interface UIMutations extends MutationTree<UIState> {
  setDrawer(state: UIState, value: boolean): void
}
