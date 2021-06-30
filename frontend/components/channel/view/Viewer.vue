<template>
  <channel-view-base
    :loading="$fetchState.pending"
    :error="$fetchState.error"
    :loading-message="loadingMessage"
    :title="title"
    :channel="channel"
    :messages="messages"
    @message="onNewMessage"
    @joined="onUserJoin"
  >
    <template slot="input">
      <channel-message-input
        v-if="hasJoined || isSiteAdmin"
        :channel="channel"
      />
      <channel-join v-else :channel="channel" @joined="onJoined" />
    </template>

    <channel-drawer-right
      :channel="channel"
      :users="users"
      :has-joined="hasJoined"
      :is-site-admin="isSiteAdmin"
      :is-owner="isOwner"
      :is-admin="isAdmin"
      :loading="$fetchState.pending"
      @refresh="$fetch()"
      @joined="onJoined"
      @leaved="onLeaved"
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

  onUserJoin(channelUser: ChannelUser) {
    this.users.push(channelUser)
  }

  get selfChannelUser() {
    const userId = authStore.user!.id

    return this.users.filter((x) => x.id === userId)[0]
  }

  get hasJoined() {
    return !!this.selfChannelUser || false
  }

  get isOwner() {
    const user = authStore.user!

    if (user.admin) {
      return true
    }

    if (this.id && this.channel) {
      return this.channel.owner.id === user.id
    }

    return false
  }

  get isAdmin() {
    return this.selfChannelUser?.admin || authStore.user!.admin
  }

  get isSiteAdmin() {
    return authStore.user!.admin
  }

  get title() {
    return this.channel?.name
  }

  onJoined() {
    this.$store.dispatch('channels/fetchAll')
    this.$fetch()
  }

  onLeaved() {
    this.$store.dispatch('channels/fetchAll')
  }
}
</script>
