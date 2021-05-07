<template>
  <v-row class="ma-4">
    <v-col cols="12" md="9">
      <channel-card :channel="channel" />
    </v-col>
    <v-col cols="12" md="3">
      <v-card>
        <channel-user-list :channel="channel" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

import { User, ChannelVisibility, ChannelUser, Channel } from '~/models'

export default Vue.extend({
  data: () => ({
    channel: {
      id: 0,
      name: 'hello',
      owner: {
        id: 1,
        username: 'enzo',
      } as User,
      visibility: ChannelVisibility.PUBLIC,
      users: [
        {
          user: {
            id: 1,
            username: 'enzo',
          } as User,
          admin: true,
          muted: true,
          banned: false,
        } as ChannelUser,
        {
          user: {
            id: 2,
            username: 'dorian',
          } as User,
          admin: false,
          muted: false,
          banned: false,
        } as ChannelUser,
      ],
    } as Channel,
  }),
  computed: {
    id() {
      return this.$route.params.id
    },
  },
})
</script>
