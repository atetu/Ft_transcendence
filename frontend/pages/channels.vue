<template>
  <channel-view-base
    :loading="$fetchState.pending"
    :error="$fetchState.error"
    @refresh="$fetch"
  >
    <nuxt-child />
  </channel-view-base>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { channelsModule } from '~/store/channels/const'

import { Channel } from '~/models'

@Component({
  async fetch() {
    await this.$store.dispatch('channels/fetchAll')
  },
})
export default class Index extends Vue {
  @channelsModule.State('channels')
  channels!: Channel[]
}
</script>
