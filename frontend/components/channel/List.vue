<template>
  <v-list>
    <channel-item
      v-for="channel in channels"
      :key="channel.id"
      :channel="channel"
    />
  </v-list>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { Channel } from '~/models'

export default Vue.extend({
  props: {
    channels: {
      type: Array as PropType<Channel[]>,
      required: true,
    },
  },
})
</script>
