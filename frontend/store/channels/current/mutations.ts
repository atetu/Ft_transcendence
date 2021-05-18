import { CurrentChannelMutations } from './types'

export const mutations: CurrentChannelMutations = {
  set(state, channel) {
    state.the = channel
  },

  setUsers(state, users) {
    state.users = users
  },

  setMessages(state, messages) {
    state.messages = messages
  },

  addMessage(state, message) {
    state.messages.push(message)
  },
}

export default mutations
