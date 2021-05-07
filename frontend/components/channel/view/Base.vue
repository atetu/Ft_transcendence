<template>
  <div>
    <v-app-bar app clipped-right :class="{ 'offset-if-drawer': drawer }">
      <v-spacer /> {{ drawer }} <v-spacer />
    </v-app-bar>

    <channel-drawer />

    <drawer-right>
      <v-list>
        <v-list-item v-for="n in 50" :key="n" link>
          <v-list-item-content>
            <v-list-item-title>Item {{ n }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template #append>
        <v-list>
          <v-list-item>
            <v-btn block color="primary">
              settings
              <v-icon right>mdi-cog</v-icon>
            </v-btn>
          </v-list-item>

          <v-list-item>
            <v-btn block color="primary">
              invite
              <v-icon right>mdi-account-plus</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
      </template>
    </drawer-right>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { State } from '~/store'

export default Vue.extend({
  computed: {
    ...mapState({
      drawer: (state: State): boolean => state.drawer,
    }),
  },
})
</script>
