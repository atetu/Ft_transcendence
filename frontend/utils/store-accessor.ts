/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import AchievementsModule from '~/store/achievements'
import AuthModule from '~/store/auth'
import DirectMessageModule from '~/store/directMessages'
import SocketModule from '~/store/socket'
import UIModule from '~/store/ui'

let uiStore: UIModule
let authStore: AuthModule
let achievementsStore: AchievementsModule
let directMessageStore: DirectMessageModule
let socketStore: SocketModule

function initializeStores(store: Store<any>): void {
  uiStore = getModule(UIModule, store)
  authStore = getModule(AuthModule, store)
  directMessageStore = getModule(DirectMessageModule, store)
  achievementsStore = getModule(AchievementsModule, store)
  socketStore = getModule(SocketModule, store)
}

export {
  initializeStores,
  uiStore,
  achievementsStore,
  directMessageStore,
  authStore,
  socketStore,
}
