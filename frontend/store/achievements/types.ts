import { ActionContext, ActionTree, MutationTree, Store } from 'vuex'
import { RootState } from '../types'
import { Achievement } from '~/models'

export interface AchievementsState {
  list: Achievement[]
}

export type AchievementsActionContext = ActionContext<
  AchievementsState,
  RootState
>
export type AchievementsStore = Store<RootState>

export interface AchievementsActions
  extends ActionTree<AchievementsState, RootState> {
  fetch(this: AchievementsStore, context: AchievementsActionContext): void
}

export interface AchievementsMutations extends MutationTree<AchievementsState> {
  setList(state: AchievementsState, list: Achievement[]): void
}
