<template>
  <page-loading v-if="$fetchState.pending" />
  <page-error
    v-else-if="$fetchState.error"
    :error="$fetchState.error"
    @click="$fetch()"
  />
  <v-main v-else class="fill-height" style="overflow: auto">
    <v-row class="ma-2">
      <v-col
        v-for="relationship in relationships"
        :key="relationship.peer.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card>
          <v-card-title>{{ relationship.peer.username }}</v-card-title>
          <v-card-subtitle>{{ relationship.type }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { Relationship } from '~/models'
import { meModule } from '~/store/me/const'

@Component
export default class Page extends Vue {
  @meModule.State('relationships')
  relationships!: Relationship[]

  head() {
    return {
      title: 'Relationships',
    }
  }

  async fetch() {
    await this.$store.dispatch('me/fetchRelationships')
  }
}
</script>
