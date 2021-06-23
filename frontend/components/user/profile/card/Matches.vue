<template>
  <v-card outlined :loading="$fetchState.pending">
    <v-card-title>
      Matches
      <v-spacer />
      <v-btn icon :loading="$fetchState.pending" @click="$fetch">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>
    <v-list>
      <match-error v-if="$fetchState.error" @retry="$fetch" />
      <template v-else>
        <match-empty v-if="!matches.length" />
        <match-list-item
          v-for="match in matches"
          :key="match.id"
          :user="user"
          :match="match"
        />
      </template>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Match, User } from '~/models'

@Component
export default class Dot extends Vue {
  @Prop()
  user!: User

  matches: Array<Match> = []

  async fetch() {
    this.matches = await this.$axios.$get(`/users/${this.user.id}/matches`)
  }
}
</script>
