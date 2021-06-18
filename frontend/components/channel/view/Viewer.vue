<template>
  <channel-view-base
    :loading="$fetchState.pending"
    :error="$fetchState.error"
    :loading-message="loadingMessage"
    :title="title"
    :channel="channel"
    :messages="messages"
    @message="onNewMessage"
  >
    <template slot="input">
      <channel-message-input v-if="hasJoined" :channel="channel" />
      <channel-join v-else :channel="channel" @joined="$fetch()" />
    </template>

    <channel-drawer-right
      :channel="channel"
      :users="users"
      :has-joined="hasJoined"
      :is-owner="isOwner"
      :is-admin="isAdmin"
      :loading="$fetchState.pending"
      @refresh="$fetch()"
    />
  </channel-view-base>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import API from '~/api/API'
import { Channel, ChannelMessage, ChannelUser } from '~/models'
import { authStore } from '~/store'

@Component
export default class Viewer extends Vue {
  @Prop({ type: Number })
  id!: number

  channel: Channel | null = null
  users: Array<ChannelUser> = []
  messages: Array<ChannelMessage> = []

  loadingMessage = ''

  async fetch() {
    this.loadingMessage = 'fetching channel'
    const channel = await API.Channels.show(this.id)

    this.loadingMessage = 'fetching users'
    const users = await API.ChannelUsers.index(channel)

    this.loadingMessage = 'fetching messages'
    const messages = await API.ChannelMessages.index(channel)

    this.loadingMessage = 'connecting to channel'
    await API.Socket.channelConnect(channel)

    this.channel = channel
    this.users = users
    this.messages = messages
  }

  onNewMessage(message: ChannelMessage) {
    this.messages.push(message)
  }

  get selfChannelUser() {
    const userId = authStore.user!.id

    return this.users.filter((x) => x.id === userId)[0]
  }

  get hasJoined() {
    return !!this.selfChannelUser
  }

  get isOwner() {
    if (this.id) {
      const userId = authStore.user!.id

      if (this.channel) {
        return this.channel.owner.id === userId
      }
    }

    return false
  }

  get isAdmin() {
    return this.selfChannelUser?.admin || false
  }

  get title() {
    return this.channel?.name
  }
}
</script>
