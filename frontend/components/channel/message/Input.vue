<template>
  <v-text-field
    ref="textField"
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
import { Component, Watch, Vue } from 'nuxt-property-decorator'

import { ChannelMessage, ChannelMessageContentType } from '~/models'

@Component
export default class Input extends Vue {
  content = ''
  loading = false

  @Watch('loading')
  onLoadingChange(val: boolean) {
    if (!val) {
      this.$nextTick(() => (this.$refs.textField as any).focus())
    }
  }

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
