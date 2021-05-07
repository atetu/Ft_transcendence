<template>
  <v-list-item nuxt :to="to">
    <v-list-item-avatar>
      <v-avatar color="primary" />
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title v-text="channelUser.user.username" />
      <v-list-item-subtitle>
        <v-chip v-if="channelUser.user.id == channel.owner.id" x-small>
          owner
        </v-chip>
        <v-chip v-if="channelUser.admin" x-small>admin</v-chip>
        <v-chip v-if="channelUser.muted" x-small>muted</v-chip>
        <v-chip v-if="channelUser.banned" x-small>banned</v-chip>
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-icon>
      <channel-user-action-menu
        :channel-user="channelUser"
        :channel="channel"
      />
    </v-list-item-icon>
  </v-list-item>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { ChannelUser, Channel } from '~/models'

export default Vue.extend({
  props: {
    channelUser: {
      type: Object as PropType<ChannelUser>,
      required: true,
    },
    channel: {
      type: Object as PropType<Channel>,
      required: true,
    },
  },
  computed: {
    to(): string {
      return `/users/${this.channelUser.user.id}`
    },
  },
})
</script>
