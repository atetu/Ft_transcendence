<template>
  <v-card class="pa-2" outlined>
    <v-row justify="center" align="center">
      <v-avatar color="indigo" size="128" class="mt-8 mb-6">
        <v-icon size="72" dark> mdi-account-circle </v-icon>
      </v-avatar>
    </v-row>
    <v-card-title class="headline">
      <v-spacer />
      {{ user.username }}
      <v-spacer />
    </v-card-title>
    <v-card-subtitle class="text-center">
      joined <br />
      15 05 2021
    </v-card-subtitle>
    <v-col cols="12">
      <v-row justify="center" align="center">
        <v-col v-if="isMe" cols="12">
          <v-btn block color="primary">
            settings
            <v-icon right>mdi-cog</v-icon>
          </v-btn>
        </v-col>
        <template v-else>
          <v-col cols="12">
            <v-btn depressed block color="primary">
              ask game
              <v-icon right>mdi-sword-cross</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" xl="6">
            <v-btn depressed block color="primary">
              friend
              <v-icon right>mdi-account-plus</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" xl="6">
            <v-btn outlined block color="primary">
              message
              <v-icon right>mdi-message-arrow-right</v-icon>
            </v-btn>
          </v-col>
        </template>
      </v-row>
    </v-col>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { authModule } from '~/store/auth/const'

import { User } from '~/models'

@Component
export default class Dot extends Vue {
  @Prop()
  user!: User

  get isMe() {
    return this.$store.state.auth.user.id === this.user.id
  }
}
</script>
