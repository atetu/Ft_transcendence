<template>
  <v-btn v-if="small" icon color="primary" @click="submit">
    <v-icon>mdi-sword-cross</v-icon>
  </v-btn>
  <v-btn v-else color="primary" @click="submit">
    challenge
    <v-icon right>mdi-sword-cross</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { DirectMessage } from '~/models'

@Component
export default class Viewer extends Vue {
  @Prop({ type: Object, required: true })
  directMessage!: DirectMessage

  loading = false

  get small() {
    return this.$vuetify.breakpoint.name === 'xs'
  }

  async submit() {
    if (this.loading) {
      return
    }

    this.loading = true

    try {
      await this.$axios.post(`pending-games`, {
        peerId: this.directMessage.peer.id,
      })
    } catch (error) {
      this.$dialog.notify.error(`Could not challenge: ${error}`)
    }

    this.loading = false
  }
}
</script>
