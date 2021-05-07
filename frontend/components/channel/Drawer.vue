<template>
  <drawer-left>
    <v-row class="ma-2">
      <v-col cols="10">
        <slot name="search">
          <v-text-field
            background-color="grey lighten-1"
            dense
            flat
            hide-details
            solo
          />
        </slot>
      </v-col>
      <v-col cols="2" class="pl-0">
        <v-btn icon>
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-divider />

    <channel-list :channels="channels" />
  </drawer-left>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { State } from '~/store'

import { Channel } from '~/models'

export default Vue.extend({
  computed: {
    ...mapState({
      channels: (state: State): Channel[] => state.channel.list,
    }),
  },
})
</script>
