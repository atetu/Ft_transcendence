import { ChannelsActions } from './types'

import { Channel } from '~/models'

export const actions: ChannelsActions = {
  async fetchAll({ commit }) {
    const channels: Channel[] = await this.$axios.$get('/channels')

    commit('setChannels', channels)
  },

  sendMessage(_, __) {},
}

export default actions
