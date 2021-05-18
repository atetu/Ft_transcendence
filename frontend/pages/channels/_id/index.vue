<template>
  <div v-if="channel" class="fill-height">
    <v-app-bar app clipped-right>
      <v-toolbar-title>{{ channel.name }} {{ id }} {{ $fetchState }}</v-toolbar-title>
      <v-spacer />
      <v-btn :input-value="true" icon>
        <v-icon>mdi-account-group</v-icon>
      </v-btn>
    </v-app-bar>

    <v-card class="mx-auto fill-height">
      <v-list class="fill-height">
        <virtual-list
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

    <drawer-right>
      <channel-user-list :channel="channel" :users="users" />
      <template #append>
        <v-list>
          <v-list-item>
            <v-btn block color="primary">
              settings
              <v-icon right>mdi-cog</v-icon>
            </v-btn>
          </v-list-item>

          <v-list-item>
            <v-btn block color="primary">
              invite
              <v-icon right>mdi-account-plus</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
      </template>
    </drawer-right>
  </div>
  <div v-else>loading...</div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator'

import ScrollItem from '~/components/channel/message/ScrollItem.vue'

import { channelsCurrentModule } from '~/store/channels/const'

import { Channel, ChannelMessage, ChannelUser } from '~/models'

@Component({
  async fetch() {
    const self = this as any /* avoid warnings */

    try {
      await this.$store.dispatch('channels/current/fetch', self.id)
      await this.$store.dispatch('channels/current/fetchUsers')
      await this.$store.dispatch('channels/current/fetchMessages')

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
  head() {
    const self = this as any /* avoid warnings */

    return {
      title: `${self.channel?.name} - channels`,
    }
  },
})
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

  @Watch('id')
  async onIdChanged() {
    await this.$fetch()
  }

  get itemComponent() {
    return ScrollItem
  }
}
</script>
