import { AchievementsActions } from './types'
import { Achievement } from '~/models'

export const actions: AchievementsActions = {
  async fetch({ commit }) {
    const achievements: Achievement[] = await this.$axios.$get('/achievements')

    commit('setList', achievements)
  },
}

export default actions
