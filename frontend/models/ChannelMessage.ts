import { User } from './User'
import { Channel } from './Channel'

export enum ChannelMessageContentType {
  MESSAGE = 'message',
  INVITE = 'invite',
}

export interface ChannelMessage {
  id: number
  contentType: ChannelMessageContentType
  content: string
  user: User
  channel: Channel
  createdAt: Date
}
