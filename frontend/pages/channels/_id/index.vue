<template>
  <div class="fill-height">
    <v-app-bar app clipped-right class="mini-drawer-offset">
      <v-toolbar-title>{{ channel.name }}</v-toolbar-title>
      <v-spacer />
      <v-btn :input-value="true" icon>
        <v-icon>mdi-account-group</v-icon>
      </v-btn>
    </v-app-bar>

    <v-card class="mx-auto fill-height">
      <v-list class="fill-height">
        <v-virtual-scroll
          class="fill-height"
          item-height="25"
          :bench="2"
          :items="Array.from({ length: 1000 }, (k, v) => v + 1)"
        >
          <template #default="{ item }">
            <v-list-item :key="item">
              <v-list-item-content>
                <v-list-item-title>
                  User Database Record <strong>ID {{ item }}</strong>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-list>
    </v-card>

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
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { channelsModule } from '~/store/channels/const'

import { Channel } from '~/models'

@Component({
  async fetch() {
    await this.$store.dispatch('channels/fetchAll')
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
}
</script>
