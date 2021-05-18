import {
  ActionTree,
  Store,
  ActionContext,
  MutationTree,
  GetterTree,
} from 'vuex'

import { RootState } from '../../types'

import { Channel, ChannelMessage, ChannelUser } from '~/models'

export interface CurrentChannelState {
  the: Channel | null
  messages: ChannelMessage[]
  users: ChannelUser[]
}

export type CurrentChannelActionContext = ActionContext<
  CurrentChannelState,
  RootState
>
export type CurrentChannelStore = Store<RootState>

export interface CurrentChannelActions
  extends ActionTree<CurrentChannelState, RootState> {
  fetch(
    this: CurrentChannelStore,
    context: CurrentChannelActionContext,
    payload: number
  ): void

  fetchUsers(
    this: CurrentChannelStore,
    context: CurrentChannelActionContext
  ): void

  fetchMessages(
    this: CurrentChannelStore,
    context: CurrentChannelActionContext
  ): void

  clear(this: CurrentChannelStore, context: CurrentChannelActionContext): void

  sendMessage(
    this: CurrentChannelStore,
    context: CurrentChannelActionContext,
    message: ChannelMessage
  ): void
}

export interface CurrentChannelMutations
  extends MutationTree<CurrentChannelState> {
  set(state: CurrentChannelState, channel: Channel): void
  setUsers(state: CurrentChannelState, users: ChannelUser[]): void
  setMessages(state: CurrentChannelState, messages: ChannelMessage[]): void
  addMessage(state: CurrentChannelState, message: ChannelMessage): void
}

export type CurrentChannelGetters = GetterTree<CurrentChannelState, RootState>
