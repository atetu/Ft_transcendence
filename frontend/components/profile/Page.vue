<template>
  <page-loading v-if="$fetchState.pending" />
  <page-error
    v-else-if="$fetchState.error"
    :error="$fetchState.error"
    @click="$fetch()"
  />
  <v-main v-else class="fill-height" style="overflow-y: auto">
    <v-row class="ma-4">
      <v-col cols="12" md="3">
        <user-profile-card-info :user="user" @refresh="$fetch" />
        <user-profile-card-statistics
          :user="user"
          :statistics="statistics"
          :loading="$fetchState.pending"
          class="mt-4"
          @refresh="$fetch"
        />
      </v-col>

      <v-col cols="12" md="6">
        <user-profile-card-matches
          :user="user"
          :matches="matches"
          :loading="$fetchState.pending"
          @refresh="$fetch"
        />
      </v-col>

      <v-col cols="12" md="3">
        <user-profile-card-last-achievements
          :user="user"
          :progresses="progresses"
          :loading="$fetchState.pending"
          @refresh="$fetch"
        />
        <v-card class="pa-2 mt-4" outlined tile>
          friends
          {{relationship}}
          <v-icon right>mdi-account-group</v-icon>
          <v-btn outlined block color="red">
            block
            <v-icon right>mdi-account-cancel</v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { AchievementProgress, Match, Relationship, User, UserStatistics } from '~/models'

@Component
export default class ComponentImpl extends Vue {
  @Prop({ type: Number })
  userId!: number

  user: User | null = null
  matches: Array<Match> = []
  progresses: Array<AchievementProgress> = []
  relationship: Relationship | null = null
  statistics: UserStatistics | null = null

  async fetch() {
    this.user = await this.$axios.$get(`/users/${this.userId}`)
    this.matches = await this.$axios.$get(`/users/${this.userId}/matches`)
    this.progresses = await this.$axios.$get(
      `/users/${this.userId}/achievements`
    )
    this.relationship = await this.$axios.$get(`/users/@me/relationships/${this.userId}`)
    this.statistics = await this.$axios.$get(`/users/${this.userId}/statistics`)
  }
}
</script>
