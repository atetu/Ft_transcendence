<template>
  <v-navigation-drawer
    :value="drawer"
    width="300"
    :class="{ 'offset-if-drawer': drawer }"
    fixed
    app
    stateless
    touchless
  >
    <slot />
  </v-navigation-drawer>
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

<style scoped>
  .offset-if-drawer {
    margin-left: 56px;
  }
</style>
