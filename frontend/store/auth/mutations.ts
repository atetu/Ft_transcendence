import { AuthMutations } from './types'

export const mutations: AuthMutations = {
  setTokens(state, tokens) {
    state.accessToken = tokens.accessToken
    state.refreshToken = tokens.refreshToken
  },

  setUser(state, user) {
    state.user = user
  },
}

export default mutations
