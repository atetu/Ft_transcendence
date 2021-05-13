import { AuthState } from './types'

const DEFAULT_WIDTH = 500
const DEFAULT_HEIGHT = 370

export const initState = (): AuthState => ({
  providers: {
    google: {
      name: 'Google',
      width: 470,
      height: 580,
    },
    marvin: {
      name: '42',
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    },
  },
  accessToken: null,
  refreshToken: null,
  user: null,
})

export default initState
