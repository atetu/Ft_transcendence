import { MeStateMutations } from './types'

export const mutations: MeStateMutations = {
  setAchievementProgresses(state, progresses) {
    state.achievementProgresses = progresses
  },
}

export default mutations
