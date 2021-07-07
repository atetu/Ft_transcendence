import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Relationship, RelationshipType } from '~/models'
import { $axios } from '~/utils/api'

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'relationships',
})
class RelationshipsModule extends VuexModule {
  list: Array<Relationship> = []

  @Mutation
  set(list: Array<Relationship>) {
    this.list = list
  }

  get blocked(): Array<Relationship> {
    return this.list.filter((x) => x.type === RelationshipType.BLOCK)
  }

  get blockedPeerIds() {
    return this.blocked.map((x) => x.peer.id)
  }

  @Action({ commit: 'set', rawError: true })
  async fetchAll() {
    const relationships: Relationship[] = await $axios.$get(
      '/users/@me/relationships'
    )

    return relationships
  }
}

export default RelationshipsModule
