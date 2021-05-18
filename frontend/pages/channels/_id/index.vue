<template>
  <channel-view-viewer
    :id="id"
    :key="id"
    :channel="channel"
    :users="users"
    :messages="messages"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { channelsCurrentModule } from '~/store/channels/const'

import { Channel, ChannelMessage, ChannelUser } from '~/models'

@Component
export default class Index extends Vue {
  @channelsCurrentModule.State('the')
  channel!: Channel

  @channelsCurrentModule.State('users')
  users!: ChannelUser[]

  @channelsCurrentModule.State('messages')
  messages!: ChannelMessage[]

  get id(): number {
    return parseInt(this.$route.params.id)
  }
}
</script>
