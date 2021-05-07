<template>
  <v-card>
    <v-card-title class="headline">
      {{ channel.name }}
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-subtitle>
      {{ channel.visibility }}
    </v-card-subtitle>
    <v-divider />
    <v-virtual-scroll
      height="500px"
      item-height="50"
      :bench="3"
      :items="new Array(10000).fill().map((x, i) => i)"
    >
      <template #default="{ item }">
        <div :key="item" :class="{ 'd-flex flex-row-reverse': true }">
          <v-menu offset-y>
            <template #activator="{ on }">
              <v-hover v-slot="{ hover }">
                <v-chip
                  dark
                  style="height: auto; white-space: normal"
                  class="pa-4 mb-2"
                  v-on="on"
                >
                  {{ item }}
                  <sub class="ml-2" style="font-size: 0.5rem">
                    {{ item }}
                  </sub>
                  <v-icon v-if="hover" small> expand_more </v-icon>
                </v-chip>
              </v-hover>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
    </v-virtual-scroll>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { Channel } from '~/models'

export default Vue.extend({
  props: {
    channel: {
      type: Object as PropType<Channel>,
      required: true,
    },
  },
})
</script>
