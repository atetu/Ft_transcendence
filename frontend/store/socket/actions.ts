import { SocketActions } from './types'

export const actions: SocketActions = {
  socket_clientConnectedList(_, ids) {
    console.log(ids)
  },
}

export default actions
