<template>
  <page-nothing-selected text="no page selected" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Page extends Vue {
  head() {
    return {
      title: 'Home',
    }
  }
}
</script>
