import { Module, Action, VuexModule, Mutation } from 'vuex-module-decorators'
import { ChannelMessage } from '~/models'

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'socket',
})
class SocketModule extends VuexModule {
  connectedUserIds: Array<number> = []
  playingUserIds: Array<number> = []

  @Mutation
  SOCKET_CLIENT_CONNECTED_LIST(ids: Array<string>) {
    this.connectedUserIds = ids.map((x) => parseInt(x, 10))
  }

  @Mutation
  SOCKET_CLIENT_CONNECTED_JOIN(id: number) {
    this.connectedUserIds.push(id)
  }

  @Mutation
  SOCKET_CLIENT_CONNECTED_QUIT(id: number) {
    const index = this.connectedUserIds.indexOf(id)

    if (index !== -1) {
      this.connectedUserIds.splice(index, 1)
    }
  }

  @Mutation
  SOCKET_CLIENT_PLAYING_LIST(ids: Array<string>) {
    this.playingUserIds = ids.map((x) => parseInt(x, 10))
  }

  @Mutation
  SOCKET_CLIENT_PLAYING_JOIN(id: number) {
    this.playingUserIds.push(id)
  }

  @Mutation
  SOCKET_CLIENT_PLAYING_QUIT(id: number) {
    const index = this.playingUserIds.indexOf(id)

    if (index !== -1) {
      this.playingUserIds.splice(index, 1)
    }
  }

  @Action({ rawError: true })
  // eslint-disable-next-line camelcase
  socket_clientConnectedList(ids: any) {
    console.log(ids)
  }

  @Action({ rawError: true })
  // eslint-disable-next-line camelcase
  socket_channelMessage(message: ChannelMessage) {
    this.context.commit('channels/current/addMessage', message, { root: true })
  }
}

export default SocketModule
