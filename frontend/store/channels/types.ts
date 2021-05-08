import {
  ActionTree,
  Store,
  ActionContext,
  MutationTree,
  GetterTree,
} from 'vuex'

import { RootState } from '../types'

import { Channel, ChannelMessage } from '~/models'

export interface ChannelsState {
  channels: Channel[]
}

export type ChannelsActionContext = ActionContext<ChannelsState, RootState>
export type ChannelsStore = Store<RootState>

export interface ChannelsActions extends ActionTree<ChannelsState, RootState> {
  fetchAll(this: ChannelsStore, context: ChannelsActionContext): void
  sendMessage(
    this: ChannelsStore,
    context: ChannelsActionContext,
    message: ChannelMessage
  ): void
}

export interface ChannelsMutations extends MutationTree<ChannelsState> {
  setChannels(state: ChannelsState, Channels: Channel[]): void
}

export type ChannelsGetters = GetterTree<ChannelsState, RootState>
