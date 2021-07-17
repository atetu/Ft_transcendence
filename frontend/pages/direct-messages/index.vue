<template>
  <page-loading v-if="$fetchState.pending" />
  <page-error
    v-else-if="$fetchState.error"
    :error="$fetchState.error"
    @click="$fetch()"
  />
  <div v-else class="fill-height" style="overflow: auto">
    <v-tabs v-model="tab" fixed-tabs>
      <v-tab v-for="item in items" :key="item.title">
        <v-icon left>mdi-{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <relationship-tab category="online" :relationships="online" />
      <relationship-tab category="all" :relationships="friends" />
      <relationship-tab category="pending" :relationships="pending" />
      <relationship-tab category="blocked" :relationships="blocked" />
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Relationship, RelationshipType } from '~/models'
import { relationshipsStore, socketStore } from '~/store'
import API from '~/api/API'

@Component
export default class Page extends Vue {
  tab = null
  items = [
    {
      title: 'online',
      icon: 'access-point',
    },
    {
      title: 'friends',
      icon: 'human-greeting',
    },
    {
      title: 'pending',
      icon: 'motion-pause',
    },
    {
      title: 'blocked',
      icon: 'block-helper',
    },
  ]

  head() {
    return {
      title: 'Relationships',
    }
  }

  get friends() {
    return relationshipsStore.list.filter(
      (x) => x.type === RelationshipType.FRIEND
    )
  }

  get online() {
    const { connectedUserIds } = socketStore

    return this.friends.filter((x) => connectedUserIds.includes(x.peer.id))
  }

  get pending() {
    return relationshipsStore.list.filter(
      (x) =>
        x.type === RelationshipType.INCOMING ||
        x.type === RelationshipType.OUTCOMING
    )
  }

  get blocked() {
    return relationshipsStore.list.filter(
      (x) => x.type === RelationshipType.BLOCK
    )
  }

  async fetch() {
    await relationshipsStore.fetchAll()
  }

  get relationships(): Array<Relationship> {
    return relationshipsStore.list
  }
}
</script>
