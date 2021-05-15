import { Store, ActionContext, MutationTree, ActionTree } from 'vuex'

import { RootState } from '../types'

export interface SocketState {
  connectedUserIds: number[]
}

export type SocketActionContext = ActionContext<SocketState, RootState>
export type SocketStore = Store<RootState>

// disable
export interface SocketActions extends ActionTree<SocketState, RootState> {
  // eslint-disable-next-line camelcase
  socket_clientConnectedList(
    this: SocketStore,
    context: SocketActionContext,
    payload: number[]
  ): void
}

export interface SocketMutations extends MutationTree<SocketState> {
  SOCKET_CLIENT_CONNECTED_LIST(state: SocketState, ids: string[]): void
  SOCKET_CLIENT_CONNECTED_JOIN(state: SocketState, id: number): void
  SOCKET_CLIENT_CONNECTED_QUIT(state: SocketState, id: number): void
}
