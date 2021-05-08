import { ChannelsMutations } from './types'

export const mutations: ChannelsMutations = {
  setChannels(state, channels) {
    state.channels = channels
  },
}

export default mutations
