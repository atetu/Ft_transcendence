import { CurrentChannelActions } from './types'

import { Channel, ChannelMessage, ChannelUser } from '~/models'

export const actions: CurrentChannelActions = {
  async fetch({ commit }, id) {
    const channel: Channel = await this.$axios.$get(`/channels/${id}`)

    commit('set', channel)
  },

  async fetchUsers({ commit, state }) {
    const id = state.the?.id

    if (id === undefined) {
      return
    }

    const users: ChannelUser[] = await this.$axios.$get(`/channels/${id}/users`)

    if (id === state.the?.id) {
      commit('setUsers', users)
    }
  },

  async fetchMessages({ commit, state }) {
    const id = state.the?.id

    if (id === undefined) {
      return
    }

    const users: ChannelMessage[] = await this.$axios.$get(
      `/channels/${id}/messages`
    )

    if (id === state.the?.id) {
      commit('setMessages', users)
    }
  },

  async sendMessage({ state }, message) {
    const id = state.the?.id

    if (id === undefined) {
      return
    }

    await this.$axios.post(`/channels/${id}/messages`, {
      type: message.type,
      content: message.content,
    })
  },
}

export default actions
