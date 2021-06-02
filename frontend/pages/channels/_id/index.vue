<template>
  <channel-view-viewer :id="id" :key="id" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Index extends Vue {
  get id(): number {
    return parseInt(this.$route.params.id)
  }
}
</script>
