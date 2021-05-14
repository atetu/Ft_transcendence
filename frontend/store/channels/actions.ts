import { ChannelsActions } from './types'

import { Channel } from '~/models'

export const actions: ChannelsActions = {
  async fetchAll({ commit }) {
    // const channels: Channel[] = await this.$axios.$get('/channels')

    commit('setChannels', [
      {
        id: 1,
        name: 'hello everyone',
        visibility: 'public',
        owner: {
          id: 1,
          username: 'enzo',
        },
        users: [
          {
            user: {
              id: 1,
              username: 'enzo',
            },
            admin: true,
            banned: false,
            muted: false,
          },
          {
            user: {
              id: 2,
              username: 'alice',
            },
            admin: false,
            banned: false,
            muted: false,
          },
          {
            user: {
              id: 3,
              username: 'badria',
            },
            admin: true,
            banned: false,
            muted: false,
          },
        ],
      },
    ])
  },

  sendMessage(_, __) {},
}

export default actions
