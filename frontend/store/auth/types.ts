import {
  ActionTree,
  Store,
  ActionContext,
  MutationTree,
  GetterTree,
} from 'vuex'

import { RootState } from '../types'

import { AuthProvider, User } from '~/models'

export interface AuthState {
  providers: { [key: string]: AuthProvider }
  accessToken: string | null
  refreshToken: string | null
  user: User | null
}

export type AuthActionContext = ActionContext<AuthState, RootState>
export type AuthStore = Store<RootState>

export interface AuthActions extends ActionTree<AuthState, RootState> {
  restoreTokens(this: AuthStore, context: AuthActionContext): void

  updateTokens(
    this: AuthStore,
    context: AuthActionContext,
    tokens: { accessToken: string; refreshToken: string }
  ): void

  fetch(this: AuthStore, context: AuthActionContext): void
}

export interface AuthMutations extends MutationTree<AuthState> {
  setTokens(
    state: AuthState,
    tokens: { accessToken: string; refreshToken: string }
  ): void

  setUser(state: AuthState, user: User): void
}

export interface AuthGetters extends GetterTree<AuthState, RootState> {
  isAuthenticated(state: AuthState): boolean
  isAdmin(state: AuthState): boolean
}
