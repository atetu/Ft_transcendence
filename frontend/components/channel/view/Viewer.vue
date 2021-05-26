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
      <v-spacer />
      <v-btn :input-value="true" icon>
        <v-icon>mdi-account-group</v-icon>
      </v-btn>
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
      <channel-message-input />
    </v-footer>

    <channel-drawer-right :channel="channel" :users="users" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'

import ScrollItem from '~/components/channel/message/ScrollItem.vue'

import { Channel, ChannelMessage, ChannelUser } from '~/models'

@Component({
  async fetch() {
    const self = this as any /* avoid warnings */

    try {
      const id = self.id

      self.loadingMessage = 'fetching channel'
      await this.$store.dispatch('channels/current/fetch', id)

      self.loadingMessage = 'fetching users'
      await this.$store.dispatch('channels/current/fetchUsers')

      self.loadingMessage = 'fetching messages'
      await this.$store.dispatch('channels/current/fetchMessages')

      self.loadingMessage = 'connecting to channel'
      await new Promise((resolve, reject) => {
        const channelId = self.id

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
  },
})
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

  scrollToBotton() {
    this.$nextTick(() => {
      const container = this.$refs.virtualMessageList as any

      if (container) {
        container.scrollToBottom()
      }
    })
  }
}
</script>
