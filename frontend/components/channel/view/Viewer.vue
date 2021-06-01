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
      <channel-message-input v-if="hasJoined" />
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

import ScrollItem from '~/components/channel/message/ScrollItem.vue'

import { Channel, ChannelMessage, ChannelUser } from '~/models'

@Component
export default class Viewer extends Vue {
  @Prop({ type: Number })
  id!: number

  @Prop({ type: Object, required: false, default: null })
  channel!: Channel

  @Prop({ type: Array })
  users!: ChannelUser[]

  @Prop({ type: Array })
  messages!: ChannelMessage[]

  loadingMessage = ''

  async fetch() {
    try {
      const channelId = this.id

      this.loadingMessage = 'fetching channel'
      await this.$store.dispatch('channels/current/fetch', channelId)

      this.loadingMessage = 'fetching users'
      await this.$store.dispatch('channels/current/fetchUsers')

      this.loadingMessage = 'fetching messages'
      await this.$store.dispatch('channels/current/fetchMessages')

      this.loadingMessage = 'connecting to channel'
      await new Promise((resolve, reject) => {
        this.$socket.client.emit(
          'channel_connect',
          {
            channelId,
          },
          (error: any, message: any) => {
            if (error) {
              reject(error)
            } else {
              resolve(message)
            }
          }
        )
      })
    } catch (error) {
      await this.$store.dispatch('channels/current/clear')
      throw error
    }
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
