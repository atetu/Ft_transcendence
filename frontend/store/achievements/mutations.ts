import { AchievementsMutations } from './types'

export const mutations: AchievementsMutations = {
  setList(state, list) {
    state.list = list
  },
}

export default mutations
