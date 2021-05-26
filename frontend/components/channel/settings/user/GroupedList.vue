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
          @click="call('POST', 'transfer', user)"
        />

        <channel-settings-action
          v-if="user.admin"
          icon="mdi-arrow-down-bold"
          tooltip="demote"
          @click="call('DELETE', 'admin', user)"
        />
        <channel-settings-action
          v-else
          icon="mdi-arrow-up-bold"
          tooltip="promote"
          @click="call('POST', 'admin', user)"
        />

        <channel-settings-action
          v-if="user.muted"
          icon="mdi-volume-mute"
          tooltip="unmute"
          @click="call('DELETE', 'mute', user)"
        />
        <channel-settings-action
          v-else
          icon="mdi-volume-plus"
          tooltip="mute"
          @click="call('POST', 'mute', user)"
        />

        <channel-settings-action
          v-if="user.banned"
          icon="mdi-check"
          tooltip="unban"
          @click="call('DELETE', 'ban', user)"
        />
        <channel-settings-action
          v-else
          icon="mdi-cancel"
          tooltip="ban"
          @click="call('POST', 'ban', user)"
        />
      </v-list-item-icon>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Method } from 'axios'
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Channel, ChannelUser } from '~/models'

@Component
export default class ComponentImpl extends Vue {
  @Prop({ type: Object })
  channel!: Channel

  @Prop({ type: Array })
  users!: ChannelUser[]

  @Prop({ type: String })
  name!: string

  @Prop({ type: Boolean })
  isOwner!: boolean

  call(method: Method, action: string, user: ChannelUser) {
    this.$confirm(
      `Are you sure you want to ${action} user ${user.username}?`
    ).then((response) => {
      if (response) {
        this.$axios.$request({
          method,
          url: `/channels/${this.channel.id}/users/${user.id}/${action}`,
        })
      }
    })
  }
}
</script>
