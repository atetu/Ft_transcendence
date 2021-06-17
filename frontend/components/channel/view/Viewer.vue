<template>
  <channel-view-loading
    v-if="$fetchState.pending && !channel"
    :message="loadingMessage"
  />
  <channel-view-error
    v-else-if="$fetchState.error"
    :error="$fetchState.error"
    @refresh="$fetch"
  />
  <div v-else class="fill-height">
    <v-app-bar app clipped-right>
      <v-toolbar-title>
        {{ title }}
      </v-toolbar-title>
    </v-app-bar>

    <v-card class="mx-auto fill-height">
      <v-list class="fill-height">
        <virtual-list
          ref="virtualMessageList"
          class="fill-height"
          style="overflow-y: auto"
          data-key="id"
          :data-sources="messages"
          :data-component="itemComponent"
        />
      </v-list>
    </v-card>

    <v-footer app height="72" inset>
      <channel-message-input v-if="hasJoined" :channel="channel" />
      <channel-join v-else :channel="channel" @joined="$fetch()" />
    </v-footer>

    <channel-drawer-right
      :channel="channel"
      :users="users"
      :has-joined="hasJoined"
      :is-owner="isOwner"
      :is-admin="isAdmin"
      :loading="$fetchState.pending"
      @refresh="$fetch()"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { Socket } from 'vue-socket.io-extended'
import API from '~/api/API'
import ScrollItem from '~/components/channel/message/ScrollItem.vue'
import { Channel, ChannelMessage, ChannelUser, DirectMessage } from '~/models'
import { authStore } from '~/store'

@Component
export default class Viewer extends Vue {
  @Prop({ type: Number })
  id!: number | null

  @Prop({ type: Number })
  peerId!: number | null

  channel: Channel | null = null
  directMessage: DirectMessage | null = null
  users: Array<ChannelUser> = []
  messages: Array<ChannelMessage> = []

  loadingMessage = ''

  async fetch() {
    let channel!: Channel
    let directMessage: DirectMessage | null = null

    console.log({
      id: this.id,
      peerId: this.peerId,
    })

    if (this.id != null) {
      this.loadingMessage = 'fetching channel'
      channel = await API.Channels.show(this.id)
    } else if (this.peerId != null) {
      this.loadingMessage = 'fetching direct messages'

      directMessage = await API.DirectMessages.show(this.peerId)
      channel = directMessage.channel
    }

    this.loadingMessage = 'fetching users'
    const users = await API.ChannelUsers.index(channel)

    this.loadingMessage = 'fetching messages'
    const messages = await API.ChannelMessages.index(channel)

    this.loadingMessage = 'connecting to channel'
    await API.Socket.channelConnect(channel)

    this.channel = channel
    this.directMessage = directMessage
    this.users = users
    this.messages = messages
  }

  @Watch('messages')
  onNewMessage() {
    this.scrollToBotton()
  }

  @Watch('$fetchState.pending')
  onFetchFinished(val: boolean) {
    if (!val) {
      setTimeout(() => this.scrollToBotton(), 100)
    }
  }

  @Socket('channel_message')
  onChannelMessage(message: ChannelMessage) {
    this.messages.push(message)
  }

  get itemComponent() {
    return ScrollItem
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
    if (this.peerId != null) {
      return this.directMessage?.peer.username
    }

    return this.channel?.name
  }

  scrollToBotton() {
    for (let _ = 0; _ < 3; _++) {
      this.$nextTick(() => {
        const container = this.$refs.virtualMessageList as any

        if (container) {
          container.scrollToBottom()
        }
      })
    }
  }
}
</script>
