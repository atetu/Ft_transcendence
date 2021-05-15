import { SocketMutations } from './types'

export const mutations: SocketMutations = {
  SOCKET_CLIENT_CONNECTED_LIST(state, ids) {
    state.connectedUserIds = ids.map((x) => parseInt(x, 10))
  },
  SOCKET_CLIENT_CONNECTED_JOIN(state, id) {
    state.connectedUserIds.push(id)
  },
  SOCKET_CLIENT_CONNECTED_QUIT(state, id) {
    const index = state.connectedUserIds.indexOf(id)
    if (index !== -1) {
      state.connectedUserIds.splice(index, 1)
    }
  },
}

export default mutations
