<template>
  <v-navigation-drawer
    v-model="rightDrawer"
    app
    clipped
    fixed
    right
    style="height: 100%"
  >
    <slot />

    <template #append>
      <slot name="append" />
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    rightDrawer: true,
  }),
})
</script>
