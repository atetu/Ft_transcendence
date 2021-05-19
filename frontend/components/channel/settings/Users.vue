<template>
  <v-card>
    <v-card-title>
      Users
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>

    <channel-settings-user-grouped-list
      v-for="(group, key) in groups"
      :key="key"
      :is-owner="isOwner"
      :channel="channel"
      :users="group.users"
      :name="group.name"
    />
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { Channel, ChannelUser } from '~/models'

@Component({
  async fetch() {
    const self: any = this

    self.users = await this.$axios.$get(`/channels/${self.channel.id}/users`)
  },
})
export default class Drawer extends Vue {
  @Prop({ type: Object })
  channel!: Channel

  users: ChannelUser[] = []

  @Prop({ type: String })
  name!: string

  get isOwner() {
    return this.$store.state.auth.user?.id === this.channel.owner.id
  }

  get groups() {
    const makeGroup = (name: string) => ({
      name: this.$t(`channel.group.${name}`),
      users: [] as ChannelUser[],
      push(user: ChannelUser) {
        this.users.push(user)
      },
    })

    const owners = makeGroup('owner')
    const admins = makeGroup('admin')
    const users = makeGroup('user')
    const banned = makeGroup('banned')

    for (const user of this.users) {
      if (user.id === this.channel.owner.id) {
        owners.push(user)
      } else if (user.banned) {
        banned.push(user)
      } else if (user.admin) {
        admins.push(user)
      } else {
        users.push(user)
      }
    }

    return {
      owners,
      admins,
      users,
      banned,
    }
  }
}
</script>
