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
import { Component, Vue } from 'nuxt-property-decorator'

import { uiModule } from '~/store/ui/const'

@Component
export default class Left extends Vue {
  @uiModule.State('drawer')
  drawer!: boolean
}
</script>

<style scoped>
  .offset-if-drawer {
    margin-left: 56px;
  }
</style>
