<template>
  <div>
    <v-app-bar app clipped-right :class="{ 'offset-if-drawer': drawer }">
      <v-spacer /> Hello <v-spacer />
    </v-app-bar>

    <channel-drawer
      :loading="loading"
      :error="error"
      @refresh="$emit('refresh')"
    />

    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { uiModule } from '~/store/ui/const'

@Component
export default class Base extends Vue {
  @Prop({ type: Boolean, default: false })
  loading!: boolean

  @Prop({ type: Object })
  error!: any

  @uiModule.State('drawer')
  drawer!: boolean
}
</script>
