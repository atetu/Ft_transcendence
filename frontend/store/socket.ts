import { Module, Action, VuexModule, Mutation } from 'vuex-module-decorators'
import { Channel, User, ChannelMessage, Relationship } from '~/models'

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'socket',
})
class SocketModule extends VuexModule {
  connectedUserIds: Array<number> = []

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

  @Action({ rawError: true })
  // eslint-disable-next-line camelcase
  socket_channelAdd(channel: Channel) {
    this.context.commit('channels/add', channel, { root: true })
  }

  @Action({ rawError: true })
  // eslint-disable-next-line camelcase
  socket_relationshipNew(relationship: Relationship) {
    this.context.commit('relationships/updateItem', relationship, {
      root: true,
    })
  }

  @Action({ rawError: true })
  // eslint-disable-next-line camelcase
  socket_relationshipUpdate(relationship: Relationship) {
    this.context.commit('relationships/updateItem', relationship, {
      root: true,
    })
  }

  @Action({ rawError: true })
  // eslint-disable-next-line camelcase
  socket_relationshipDelete(user: User) {
    this.context.commit('relationships/deleteItem', user, {
      root: true,
    })
  }
}

export default SocketModule
