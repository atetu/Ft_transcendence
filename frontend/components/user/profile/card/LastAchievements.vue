<template>
  <v-card outlined :loading="$fetchState.pending">
    <v-card-title>
      Achievements
      <v-spacer />
      <v-btn icon :loading="$fetchState.pending" @click="$fetch">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>
    <v-list>
      <match-error v-if="$fetchState.error" @retry="$fetch" />
      <template v-else>
        <match-empty v-if="!progresses.length" />
        <v-list-item
          v-for="progress in progresses"
          :key="progress.achievement.id"
        >
          <v-list-item-content>
            <achievement-card outlined :progress="progress" />
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { AchievementProgress, User } from '~/models'

@Component
export default class Dot extends Vue {
  @Prop()
  user!: User

  progresses: Array<AchievementProgress> = []

  async fetch() {
    this.progresses = await this.$axios.$get(
      `/users/${this.user.id}/achievements`
    )
  }
}
</script>
