<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-x left>
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs" />
    </template>

    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <user-avatar :size="40" :user="user" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.username }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text :to="toProfile" color="primary"> profile </v-btn>
        <v-btn text :to="toMessage"> message </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { Channel, ChannelUser } from '~/models'

@Component
export default class ComponentImpl extends Vue {
  @Prop({ type: Object })
  channel!: Channel

  @Prop({ type: Object })
  user!: ChannelUser

  menu = false

  get toProfile() {
    return `/users/${this.user.id}`
  }

  get toMessage() {
    return `/direct-messages/${this.user.id}`
  }
}
</script>
