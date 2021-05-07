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
        <channel-action v-if="admin" title="demote" icon="mdi-arrow-up-bold" />
        <channel-action v-else title="promote" icon="mdi-arrow-down-bold" />
      </template>

      <channel-action v-if="muted" title="unmute" icon="mdi-volume-plus" />
      <channel-action v-else title="mute" icon="mdi-volume-mute" />

      <channel-action v-if="banned" title="unban" icon="mdi-check" />
      <channel-action v-else title="ban" icon="mdi-cancel" />
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { ChannelUser } from '~/models'

export default Vue.extend({
  props: {
    channelUser: {
      type: Object as PropType<ChannelUser>,
      required: true,
    },
    owner: {
      type: Boolean as PropType<Boolean>,
      required: false,
      default: false,
    },
  },
  computed: {
    admin(): Boolean {
      return this.channelUser.admin
    },
    banned(): Boolean {
      return this.channelUser.banned
    },
    muted(): Boolean {
      return this.channelUser.muted
    },
  },
})
</script>
