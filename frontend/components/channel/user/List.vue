<template>
  <v-list>
    <channel-user-item
      v-for="channelUser in channel.users"
      :key="channelUser.user.id"
      :channel-user="channelUser"
      :channel="channel"
    />
  </v-list>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { Channel } from '~/models'

export default Vue.extend({
  props: {
    channel: {
      type: Object as PropType<Channel>,
      required: true,
    },
  },
})
</script>
