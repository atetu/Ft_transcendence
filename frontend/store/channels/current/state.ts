import { CurrentChannelState } from './types'

export const initState = (): CurrentChannelState => ({
  the: null,
  messages: [],
  users: [],
})

export default initState
