import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'ui',
})
class UIModule extends VuexModule {
  drawer = true

  @Mutation
  setDrawer(value: boolean) {
    this.drawer = value
  }
}

export default UIModule
