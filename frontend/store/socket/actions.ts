import { SocketActions } from './types'

export const actions: SocketActions = {
  socket_clientConnectedList(_, ids) {
    console.log(ids)
  },

  socket_channelMessage({ commit }, message) {
    commit('channels/current/addMessage', message, { root: true })
  },
}

export default actions
