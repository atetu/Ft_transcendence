<template>
  <v-navigation-drawer
    :value="drawer"
    width="300"
    class="mini-drawer-offset"
    fixed
    app
    stateless
    touchless
  >
    <slot />

    <template #append>
      <slot name="append" />
    </template>
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
