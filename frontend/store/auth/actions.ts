import { AuthActions } from './types'

import { User } from '~/models'

export const actions: AuthActions = {
  restoreTokens({ commit }) {
    const accessToken = localStorage.getItem('AUTH_ACCESS_TOKEN')
    const refreshToken = localStorage.getItem('AUTH_REFRESH_TOKEN')

    if (accessToken && refreshToken) {
      commit('setTokens', {
        accessToken,
        refreshToken,
      })
    }
  },

  updateTokens({ commit }, tokens) {
    localStorage.setItem('AUTH_ACCESS_TOKEN', tokens.accessToken)
    localStorage.setItem('AUTH_REFRESH_TOKEN', tokens.refreshToken)

    commit('setTokens', tokens)
  },

  clearTokens({ commit }) {
    localStorage.removeItem('AUTH_ACCESS_TOKEN')
    localStorage.removeItem('AUTH_REFRESH_TOKEN')

    commit('setTokens', {
      accessToken: null,
      refreshToken: null,
    })
  },

  async refreshTokens({ dispatch, state }) {
    const { accessToken, refreshToken } = await this.$axios.$post(
      '/auth/refresh-token',
      {
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }
    )

    await dispatch('updateTokens', {
      accessToken,
      refreshToken,
    })
  },

  async logout({ commit, dispatch }) {
    await dispatch('clearTokens')
    commit('setUser', null)
  },

  async fetch({ commit }) {
    const user: User = await this.$axios.$get('/users/@me')

    commit('setUser', user)
  },
}

export default actions
