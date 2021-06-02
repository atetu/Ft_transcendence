import AchievementsAPI from './AchievementsAPI'
import ChannelMessagesAPI from './ChannelMessagesAPI'
import ChannelsAPI from './ChannelsAPI'
import ChannelUsersAPI from './ChannelUsersAPI'
import SearchAPI from './SearchAPI'
import SocketAPI from './SocketAPI'
import UsersAPI from './UsersAPI'

export default class API {
  static Achievements = AchievementsAPI
  static Users = UsersAPI
  static Channels = ChannelsAPI
  static ChannelMessages = ChannelMessagesAPI
  static ChannelUsers = ChannelUsersAPI
  static Search = SearchAPI
  static Socket = SocketAPI
}
