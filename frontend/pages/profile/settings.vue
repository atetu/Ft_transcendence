<template>
  <v-main class="fill-height">
    <v-row class="ma-4">
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>Security</v-card-title>
          <v-card-text>
            <v-form>
              <profile-settings-2-factor />
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { authModule } from '~/store/auth/const'

import { User } from '~/models'

@Component
export default class Dot extends Vue {
  @authModule.State('user')
  user!: User

  statistics = [
    {
      name: 'games won',
      value: 5,
    },
    {
      name: 'games lost',
      value: 9,
    },
    {
      name: 'games',
      value: 14,
    },
  ]
}
</script>
