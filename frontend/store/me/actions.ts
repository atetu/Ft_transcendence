import { MeStateActions } from './types'
import { AchievementProgress } from '~/models'

export const actions: MeStateActions = {
  async fetch({ commit }) {
    const progresses: AchievementProgress[] = await this.$axios.$get(
      '/users/@me/achievements'
    )

    commit('setAchievementProgresses', progresses)
  },
}

export default actions
