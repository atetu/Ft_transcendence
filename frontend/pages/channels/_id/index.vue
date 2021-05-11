<template>
  <div v-if="channel" class="fill-height">
    <v-app-bar app clipped-right class="mini-drawer-offset">
      <v-toolbar-title>{{ channel.name }}</v-toolbar-title>
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
          :data-sources="
            Array.from({ length: 100 }, (_, v) => ({
              id: v + 1,
              user: channel.users[v % channel.users.length].user,
              content: 'a'.repeat((v % 10) * 20 + 3) + v,
            }))
          "
          :data-component="itemComponent"
        />
      </v-list>
    </v-card>

    <v-footer app height="72" inset class="mini-drawer-offset">
      <v-text-field background-color="grey lighten-1" dense solo class="mt-2">
        <template #append-outer>
          <v-btn icon class="ml-2">
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-footer>

    <drawer-right>
      <channel-user-list :channel="channel" />
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
import { Component, Vue } from 'nuxt-property-decorator'

import { channelsModule } from '~/store/channels/const'

import { Channel } from '~/models'

const ScrollItem = require('~/components/channel/message/ScrollItem')

@Component({
  async fetch() {
    await this.$store.dispatch('channels/fetchAll')
  },
  head() {
    const self = this as any /* avoid warnings */

    return {
      title: `${self.channel?.name} - channels`,
    }
  },
})
export default class Index extends Vue {
  @channelsModule.State('channels')
  channels!: Channel[]

  get id(): number {
    return parseInt(this.$route.params.id)
  }

  get channel(): Channel | null {
    const id = this.id

    return this.channels.filter((x) => x.id === id)[0]
  }

  get itemComponent() {
    return ScrollItem
  }
}
</script>
