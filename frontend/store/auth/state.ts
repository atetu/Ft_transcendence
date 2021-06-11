import { AuthState } from './types'

const DEFAULT_WIDTH = 470
const DEFAULT_HEIGHT = 580

export const initState = (): AuthState => ({
  providers: {
    google: {
      name: 'Google',
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
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
