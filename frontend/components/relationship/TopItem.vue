<template>
  <v-list>
    <v-list-item to="/direct-messages/" :exact="exact">
      <v-list-item-avatar>
        <v-icon>mdi-human-greeting</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>Friends</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class TopItem extends Vue {
  get exact() {
    return this.$route.params.peerid !== undefined
  }
}
</script>
