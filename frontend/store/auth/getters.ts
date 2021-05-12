import { AuthGetters } from './types'

export const getters: AuthGetters = {
  isAuthenticated(state) {
    console.log(state.user)

    return !!state.user
  },
  isAdmin(state) {
    return state.user?.admin === true
  },
}

export default getters
