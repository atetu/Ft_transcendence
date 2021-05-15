import { SocketState } from './types'

export const initState = (): SocketState => ({
  connectedUserIds: [],
})

export default initState
