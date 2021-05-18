<template>
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
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { Channel, ChannelUser } from '~/models'

@Component
export default class Index extends Vue {
  @Prop({ type: Object })
  channel!: Channel

  @Prop({ type: Array })
  users!: ChannelUser[]
}
</script>
