<template>
  <v-list-item link :to="to">
    <v-list-item-avatar size="60">
      <user-avatar :user="user" />
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>
        {{ user.username }}
        <icon-tooltip v-if="user.admin" icon-right top text="Administrator">
          mdi-account-supervisor
        </icon-tooltip>
        <icon-tooltip v-if="playing" icon-right top text="Playing">
          mdi-controller-classic
        </icon-tooltip>
        <icon-tooltip v-if="blocked" icon-right top text="Blocked">
          mdi-account-remove
        </icon-tooltip>
        <icon-tooltip v-if="user.banned" icon-right top text="Banned">
          mdi-cancel
        </icon-tooltip>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { User } from '~/models'
import { relationshipsStore, socketStore } from '~/store'

@Component
export default class Item extends Vue {
  @Prop()
  user!: User

  get to() {
    return `/users/${this.user.id}`
  }

  get playing(): boolean {
    return socketStore.playingUserIds.includes(this.user.id)
  }

  get blocked(): boolean {
    return relationshipsStore.blockedPeerIds.includes(this.user.id)
  }
}
</script>
