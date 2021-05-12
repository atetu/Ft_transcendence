<template>
  <div class="d-block text-center mx-auto mt-4">
    <v-tooltip right>
      <template #activator="{ on, attr }">
        <v-btn icon large nuxt to="/profile" v-bind="attr" v-on="on">
          <v-avatar color="grey darken-1" size="36">
            <span v-if="isAuthenticated" class="white--text headline">
              {{ initial }}
            </span>
            <v-icon v-else small>mdi-account-question</v-icon>
          </v-avatar>
        </v-btn>
      </template>

      <span>profile</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { authModule } from '~/store/auth/const'

import { User } from '~/models'

@Component
export default class Dot extends Vue {
  @authModule.Getter('isAuthenticated')
  isAuthenticated!: boolean

  @authModule.State('user')
  user!: User

  public get initial() {
    return this.user.username.charAt(0).toUpperCase()
  }
}
</script>
