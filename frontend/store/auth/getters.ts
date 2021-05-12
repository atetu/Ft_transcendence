import { AuthGetters } from './types'

export const getters: AuthGetters = {
  isAuthenticated(state) {
    return !!state.user
  },
  isAdmin(state) {
    return state.user?.admin === true
  },
}

export default getters
