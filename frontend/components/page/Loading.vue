<template>
  <v-main>
    <v-container fill-height fluid>
      <v-row align="center">
        <v-col align="center">
          <h1 v-if="title">{{ title }}</h1>
          <v-progress-circular indeterminate />
          <slot />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class Loading extends Vue {
  @Prop()
  title!: string | null
}
</script>
