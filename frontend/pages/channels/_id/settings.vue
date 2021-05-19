<template>
  <channel-view-error
    v-if="$fetchState.error"
    :error="$fetchState.error"
    @refresh="$fetch"
  />
  <channel-view-loading v-else-if="$fetchState.pending && !channel" />
  <div v-else class="pa-4 fill-height" style="overflow-y: scroll">
    <v-app-bar app clipped-right>
      <v-toolbar-title> {{ channel.name }} </v-toolbar-title>
    </v-app-bar>

    <v-row>
      <v-col cols="12">
        <v-card :loading="$fetchState.pending">
          <v-card-title>
            Channel
            <v-spacer />
            <v-btn icon :loading="$fetchState.pending" @click="$fetch">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <channel-settings-edit :initial="channel" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <channel-settings-users
          :channel="channel"
          :users="users"
          :loading="$fetchState.pending"
          @refresh="$fetch()"
        />
      </v-col>

      <v-col cols="12">
        <v-card>
          <v-alert outlined color="red" class="pa-0">
            <v-card-title> Danger Zone </v-card-title>
            <v-card-text>
              <v-btn color="primary">clear messages</v-btn>
              <v-btn color="primary" class="ml-2">delete channel</v-btn>
            </v-card-text>
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { Channel, ChannelUser } from '~/models'

@Component({
  async fetch() {
    const self: any = this

    self.channel = await this.$axios.$get(`/channels/${self.id}`)
    self.users = await this.$axios.$get(`/channels/${self.id}/users`)
  },
})
export default class Index extends Vue {
  channel: Channel | null = null
  users: ChannelUser[] = []

  get id(): number {
    return parseInt(this.$route.params.id)
  }
}
</script>
