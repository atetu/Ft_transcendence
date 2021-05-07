import { User } from './User'
import { Channel } from './Channel'

export interface ChannelUser {
  user: User
  channel?: Channel
  admin: Boolean
  muted: Boolean
  banned: Boolean
}
