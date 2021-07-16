<template>
  <div>
    <channel-drawer
      :loading="$fetchState.pending"
      :error="$fetchState.error"
      :items="unblockedDirectMessages"
      :filterer="filterer"
      @refresh="$fetch"
    >
      <template #default="{ items }">
        <direct-message-list :direct-messages="items" />
      </template>
    </channel-drawer>

    <v-main class="fill-height">
      <page-socket-not-connected v-if="!$socket.connected" />
      <nuxt-child v-else />
    </v-main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { DirectMessage } from '~/models'
import { directMessageStore, relationshipsStore } from '~/store'

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

  get unblockedDirectMessages(): Array<DirectMessage> {
    const blockedUserIds = relationshipsStore.blockedPeerIds

    return this.directMessages.filter(
      (x) => !blockedUserIds.includes(x.peer.id)
    )
  }

  filterer(query: string, item: DirectMessage) {
    if (!query?.length) {
      return true
    }

    return item.peer.username.includes(query)
  }
}
</script>
