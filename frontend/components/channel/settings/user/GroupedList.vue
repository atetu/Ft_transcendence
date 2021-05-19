<template>
  <v-list v-if="users.length" subheader>
    <v-subheader>{{ name }}</v-subheader>

    <v-list-item v-for="user in users" :key="user.id">
      <v-list-item-avatar>
        <user-avatar :user="user" />
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>{{ user.username }}</v-list-item-title>
      </v-list-item-content>

      <v-list-item-icon>
        <channel-settings-action
          v-if="isOwner"
          icon="mdi-swap-horizontal-bold"
          tooltip="transfer ownership"
        />

        <channel-settings-action
          v-if="user.admin"
          icon="mdi-arrow-down-bold"
          tooltip="demote"
        />
        <channel-settings-action
          v-else
          icon="mdi-arrow-up-bold"
          tooltip="promote"
        />

        <channel-settings-action
          v-if="user.muted"
          icon="mdi-volume-mute"
          tooltip="unmute"
        />
        <channel-settings-action v-else icon="mdi-volume-plus" tooltip="mute" />

        <channel-settings-action
          v-if="user.banned"
          icon="mdi-check"
          tooltip="unban"
        />
        <channel-settings-action v-else icon="mdi-cancel" tooltip="ban" />
      </v-list-item-icon>
    </v-list-item>
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

  @Prop({ type: String })
  name!: string

  @Prop({ type: Boolean })
  isOwner!: boolean
}
</script>
