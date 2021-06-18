<template>
  <channel-view-base
    :loading="$fetchState.pending"
    :error="$fetchState.error"
    :loading-message="loadingMessage"
    :title="title"
    :channel="channel"
    :messages="messages"
    @message="onNewMessage"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import API from '~/api/API'
import { Channel, ChannelMessage, DirectMessage } from '~/models'
import { directMessageStore } from '~/store'

@Component
export default class Viewer extends Vue {
  @Prop({ type: Number })
  peerId!: number

  directMessage: DirectMessage | null = null
  messages: Array<ChannelMessage> = []

  loadingMessage = ''

  async fetch() {
    this.loadingMessage = 'fetching direct messages'

    const directMessage = await API.DirectMessages.show(this.peerId)
    const channel = directMessage.channel

    this.loadingMessage = 'fetching messages'
    const messages = await API.ChannelMessages.index(channel)

    this.loadingMessage = 'connecting to channel'
    await API.Socket.channelConnect(channel)

    this.directMessage = directMessage
    this.messages = messages

    directMessageStore.fetchAll().catch(() => {})
  }

  get channel(): Channel | null {
    return this.directMessage?.channel || null
  }

  get title() {
    return this.directMessage?.peer.username
  }

  onNewMessage(message: ChannelMessage) {
    this.messages.push(message)
  }
}
</script>
