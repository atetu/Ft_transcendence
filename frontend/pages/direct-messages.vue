<template>
  <div>
    <channel-drawer
      :loading="$fetchState.pending"
      :error="$fetchState.error"
      :items="directMessages"
      :filterer="filterer"
      @refresh="$fetch"
    >
      <template #default="{ items }">
        <direct-message-list :direct-messages="items" />
      </template>
    </channel-drawer>

    <v-main class="fill-height">
      <nuxt-child />
    </v-main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { DirectMessage } from '~/models'
import { directMessageStore } from '~/store'

@Component
export default class Index extends Vue {
  head() {
    return {
      title: 'direct messages',
    }
  }

  async fetch() {
    await directMessageStore.fetchAll()
  }

  get directMessages(): Array<DirectMessage> {
    return directMessageStore.list
  }

  filterer(query: string, item: DirectMessage) {
    if (!query?.length) {
      return true
    }

    return item.peer.username.includes(query)
  }
}
</script>
