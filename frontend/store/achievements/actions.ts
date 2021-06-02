import { AchievementsActions } from './types'
import AchievementsAPI from '~/api/AchievementsAPI'

export const actions: AchievementsActions = {
  async fetch({ commit }) {
    const achievements = await AchievementsAPI.index()

    commit('setList', achievements)
  },
}

export default actions
