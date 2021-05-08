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
        <v-btn icon :loading="loading" @click="refresh">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-divider />

    <v-alert v-if="error" type="error" class="ma-2">
      {{ error.message || 'error when fetching channels' }}
    </v-alert>

    <channel-list :channels="channels" />
  </drawer-left>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { channelsModule } from '@/store/channels/const'

import { Channel } from '~/models'

@Component
export default class Drawer extends Vue {
  @Prop({ type: Boolean, default: false })
  loading!: boolean

  @Prop({ type: Object })
  error!: any

  @channelsModule.State('channels')
  channels!: Channel[]

  refresh(): void {
    this.$emit('refresh')
  }
}
</script>
