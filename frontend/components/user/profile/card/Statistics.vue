<template>
  <v-card outlined :loading="$fetchState.pending">
    <v-card-title>
      Statistics
      <v-spacer />
      <v-btn icon :loading="$fetchState.pending" @click="$fetch">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>
    <v-list>
      <match-error v-if="$fetchState.error" @retry="$fetch" />
      <template v-else-if="statistics != null">
        <user-statistics-list-item
          icon="mdi-crown"
          name="Win Count"
          :value="statistics.winCount"
        />
        <user-statistics-list-item
          icon="mdi-trophy-broken"
          name="Loss Count"
          :value="statistics.lossCount"
        />
      </template>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { User, UserStatistics } from '~/models'

@Component
export default class Dot extends Vue {
  @Prop()
  user!: User

  statistics: UserStatistics | null = null

  async fetch() {
    this.statistics = await this.$axios.$get(
      `/users/${this.user.id}/statistics`
    )
  }
}
</script>
