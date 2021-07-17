<template>
  <relationship-item-base :relationship="relationship">
    <template #icons>
      <v-btn icon :loading="loading" @click.prevent="accept">
        <v-icon>mdi-check-bold</v-icon>
      </v-btn>
      <v-btn icon :loading="loading" @click.prevent="refuse">
        <v-icon>mdi-close-thick</v-icon>
      </v-btn>
    </template>
  </relationship-item-base>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Relationship, RelationshipType } from '~/models'
import { relationshipsStore } from '~/store'

@Component
export default class ComponentImpl extends Vue {
  @Prop()
  relationship!: Relationship

  loading = false

  async accept() {
    if (this.loading) {
      return
    }

    this.loading = true

    try {
      const { peer } = this.relationship

      await this.$axios.$post(`/users/@me/relationships`, {
        peerId: peer.id,
        type: RelationshipType.FRIEND,
      })

      relationshipsStore.deleteItem(peer)
    } catch (error) {
      this.$dialog.notify.error(`Could not unblock: ${error}`)
    }

    this.loading = false
  }

  async refuse() {
    if (this.loading) {
      return
    }

    this.loading = true

    try {
      const { peer } = this.relationship

      await this.$axios.$delete(`/users/@me/relationships/${peer.id}`)

      relationshipsStore.deleteItem(peer)
    } catch (error) {
      this.$dialog.notify.error(`Could not refuse: ${error}`)
    }

    this.loading = false
  }
}
</script>
