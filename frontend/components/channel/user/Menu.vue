<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-x left>
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs" />
    </template>

    <v-card :loading="loading">
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <user-avatar :size="40" :user="user" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.username }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider />

      <template v-if="statistics">
        <user-statistics :statistics="statistics" />
        <v-divider />
      </template>

      <template v-else-if="error">
        <v-card-text> could not fetch user statistics </v-card-text>
        <v-divider />
      </template>

      <v-card-actions>
        <v-spacer />

        <v-btn text :to="toProfile" color="primary"> profile </v-btn>
        <v-btn text :to="toMessage"> message </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'

import { Channel, ChannelUser, UserStatistics } from '~/models'

@Component
export default class ComponentImpl extends Vue {
  @Prop({ type: Object })
  channel!: Channel

  @Prop({ type: Object })
  user!: ChannelUser

  menu = false
  statistics: UserStatistics | null = null

  loading = false
  error: any = null

  async fetchStatistics() {
    if (this.loading) {
      return
    }

    this.loading = true
    this.error = null

    try {
      this.statistics = await this.$axios.$get(
        `/users/${this.user.id}/statistics`
      )
    } catch (error) {
      this.error = error
    }

    this.loading = false
  }

  get toProfile() {
    return `/users/${this.user.id}`
  }

  get toMessage() {
    return `/direct-messages/${this.user.id}`
  }

  @Watch('menu')
  onMenuOpenStateUpdate(val: boolean) {
    if (val) {
      this.fetchStatistics()
    }
  }
}
</script>
