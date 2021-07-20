<template>
  <v-btn v-if="small" icon color="primary" @click="submit">
    <v-icon>mdi-sword-cross</v-icon>
  </v-btn>
  <v-btn v-else color="primary" :block="block" @click="submit">
    challenge
    <v-icon right>mdi-sword-cross</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { User } from '~/models'

@Component
export default class Viewer extends Vue {
  @Prop({ type: Object, required: true })
  peer!: User

  @Prop({ type: Boolean })
  block!: boolean

  @Prop({ type: Boolean })
  neverSmall!: boolean

  loading = false

  get small() {
    if (this.neverSmall) {
      return false
    }

    return this.$vuetify.breakpoint.name === 'xs'
  }

  async submit() {
    if (this.loading) {
      return
    }

    this.loading = true

    try {
      await this.$axios.post(`pending-games`, {
        peerId: this.peer.id,
      })

      this.$emit('success')
    } catch (error) {
      this.$dialog.notify.error(`Could not challenge: ${error}`)
    }

    this.loading = false
  }
}
</script>
