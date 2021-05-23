import { ActionContext, ActionTree, MutationTree, Store } from 'vuex'
import { RootState } from '../types'
import { AchievementProgress } from '~/models'

export interface MeStateState {
  achievementProgresses: AchievementProgress[]
}

export type MeStateActionContext = ActionContext<MeStateState, RootState>
export type MeStateStore = Store<RootState>

export interface MeStateActions extends ActionTree<MeStateState, RootState> {
  fetch(this: MeStateStore, context: MeStateActionContext): void
}

export interface MeStateMutations extends MutationTree<MeStateState> {
  setAchievementProgresses(
    state: MeStateState,
    progresses: AchievementProgress[]
  ): void
}
