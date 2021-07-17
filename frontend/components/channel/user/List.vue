<template>
  <v-list>
    <channel-user-item
      v-for="user in nonBanned"
      :key="user.id"
      :user="user"
      :channel="channel"
    />
  </v-list>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { Channel, ChannelUser } from '~/models'

@Component
export default class Drawer extends Vue {
  @Prop({ type: Object })
  channel!: Channel

  @Prop({ type: Array })
  users!: ChannelUser[]

  get nonBanned() {
    return this.users.filter((x) => !x.banned)
  }
}
</script>
