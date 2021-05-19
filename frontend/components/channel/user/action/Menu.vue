<template>
  <v-menu>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        color="primary"
        dark
        v-bind="attrs"
        v-on="on"
        @click.stop.prevent
      >
        <v-icon> mdi-dots-vertical </v-icon>
      </v-btn>
    </template>
    <v-list>
      <template v-if="owner">
        <channel-list-item-action
          v-if="admin"
          title="demote"
          icon="mdi-arrow-up-bold"
        />
        <channel-list-item-action
          v-else
          title="promote"
          icon="mdi-arrow-down-bold"
        />
      </template>

      <channel-list-item-action
        v-if="muted"
        title="unmute"
        icon="mdi-volume-plus"
      />
      <channel-list-item-action v-else title="mute" icon="mdi-volume-mute" />

      <channel-list-item-action v-if="banned" title="unban" icon="mdi-check" />
      <channel-list-item-action v-else title="ban" icon="mdi-cancel" />
    </v-list>
  </v-menu>
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

  public get owner() {
    return this.channel.owner?.id === this.user.id
  }

  public get admin() {
    return this.user.admin
  }

  public get banned() {
    return this.user.banned
  }

  public get muted() {
    return this.user.muted
  }
}
</script>
