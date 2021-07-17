<template>
  <v-list>
    <v-card-text v-if="!nonBlocked.length" class="text-center">
      <template v-if="filter"> no result with filter `{{ filter }}` </template>
      <template v-else> no user available </template>
    </v-card-text>
    <user-item v-for="user in nonBlocked" :key="user.id" :user="user" />
    <v-card-text v-if="hiddenCount" class="text-center text--secondary">
      hiding {{ hiddenCount }} user(s)
    </v-card-text>
  </v-list>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { User } from '~/models'
import { relationshipsStore } from '~/store'

@Component
export default class List extends Vue {
  @Prop()
  users!: User[]

  @Prop()
  filter!: string

  get filtered() {
    const { filter } = this

    if (!filter?.length) {
      return this.users
    }

    return this.users.filter((x) => x.username.includes(filter))
  }

  get nonBlocked() {
    const { blockedPeerIds } = relationshipsStore

    return this.filtered.filter((x) => !blockedPeerIds.includes(x.id))
  }

  get hiddenCount() {
    return this.filtered.length - this.nonBlocked.length
  }
}
</script>
