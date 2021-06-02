<template>
  <div class="pa-4 fill-height" style="overflow-y: scroll">
    <v-app-bar app clipped-right>
      <v-toolbar-title> {{ $t('channel.discover._') }} </v-toolbar-title>
    </v-app-bar>

    <v-row>
      <v-col
        v-for="channel in notAddedChannels"
        :key="channel.id"
        cols="12"
        md="6"
      >
        <channel-discover-card-item :channel="channel" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import API from '~/api/API'
import { Channel } from '~/models'

import { channelsModule } from '~/store/channels/const'

@Component
export default class Page extends Vue {
  channels: Channel[] = []

  @channelsModule.State('channels')
  addedChannels!: Channel[]

  async fetch() {
    await this.$store.dispatch('channels/fetchAll')
    this.channels = await API.Channels.index()
  }

  get addedChannelIds() {
    return this.addedChannels.map((x) => x.id)
  }

  get notAddedChannels() {
    const addedChannelIds = this.addedChannelIds

    return this.channels.filter((x) => !addedChannelIds.includes(x.id))
  }
}
</script>
