<template>
  <v-text-field
    v-model="content"
    :disabled="loading"
    background-color="grey lighten-1"
    dense
    solo
    class="mt-2"
    @keydown.enter="submit"
  >
    <template #append-outer>
      <v-btn :loading="loading" icon class="ml-2" @click="submit">
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { ChannelMessage, ChannelMessageContentType } from '~/models'

@Component
export default class Input extends Vue {
  content = ''

  loading = false

  public async submit() {
    if (this.loading) {
      return
    }

    this.loading = true

    try {
      await this.$store.dispatch('channels/current/sendMessage', {
        type: ChannelMessageContentType.TEXT,
        content: this.content,
      } as ChannelMessage)

      this.content = ''
    } catch (error) {
      console.log(error)
    }

    this.loading = false
  }
}
</script>
