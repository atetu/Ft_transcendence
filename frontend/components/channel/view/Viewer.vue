<template>
  <channel-view-loading v-if="$fetchState.pending" :message="loadingMessage" />
  <channel-view-error
    v-else-if="$fetchState.error"
    :error="$fetchState.error"
    @refresh="$fetch"
  />
  <div v-else class="fill-height">
    <v-app-bar app clipped-right>
      <v-toolbar-title>
        {{ channel.name }}
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
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { Socket } from 'vue-socket.io-extended'
import API from '~/api/API'
import ScrollItem from '~/components/channel/message/ScrollItem.vue'
import { Channel, ChannelMessage, ChannelUser } from '~/models'

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

  get hasJoined() {
    const userId = this.$store.state.auth.user.id

    return this.users.filter((x) => x.id === userId).length !== 0
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
