<template>
  <page-centered plain>
    <v-icon class="animated-icon" size="128">mdi-hand-pointing-left</v-icon>
    <v-card-text> {{ text }} </v-card-text>
  </page-centered>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class NothingSelected extends Vue {
  @Prop({ type: String })
  text!: string
}
</script>

<style scoped>
  .animated-icon {
    position: relative;
    animation: bouncing 1s infinite;
    animation-direction: alternate;
  }

  @keyframes bouncing {
    0% {
      left: -20px;
    }
    100% {
      left: 20px;
    }
  }
</style>
