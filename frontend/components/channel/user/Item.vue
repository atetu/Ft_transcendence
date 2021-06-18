<template>
  <channel-user-menu :channel="channel" :user="user">
    <template #activator="{ on, attrs }">
      <v-list-item v-bind="attrs" v-on="on">
        <v-list-item-avatar>
          <user-avatar :user="user" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="user.username" />
          <v-list-item-subtitle>
            <v-chip
              v-if="channel.owner && user.id === channel.owner.id"
              x-small
            >
              owner
            </v-chip>
            <v-chip v-if="user.admin" x-small>admin</v-chip>
            <v-chip v-if="user.muted" x-small>muted</v-chip>
            <v-chip v-if="user.banned" x-small>banned</v-chip>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
  </channel-user-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { Channel, ChannelUser } from '~/models'

@Component
export default class Drawer extends Vue {
  @Prop({ type: Object })
  channel!: Channel

  @Prop({ type: Object })
  user!: ChannelUser
}
</script>
