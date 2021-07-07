<template>
  <v-list-item v-if="hidden && !display" style="align-self: unset">
    <v-list-item-avatar style="align-self: unset">
      <v-tooltip left>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" @click="unlock" v-on="on">
            <v-icon>mdi-lock-question</v-icon>
          </v-btn>
        </template>
        <span>Click to see anyway</span>
      </v-tooltip>
    </v-list-item-avatar>
    <v-list-item-content class="pt-2">
      <v-list-item-title>Hidden message</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
  <v-list-item v-else style="align-items: unset">
    <v-list-item-avatar style="align-self: unset">
      <user-avatar :size="40" :user="message.user" without-state />
    </v-list-item-avatar>

    <v-list-item-content class="pt-2 break">
      <v-list-item-title>{{ message.user.username }}</v-list-item-title>
      <p class="text--secondary">{{ message.content }}</p>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { ChannelMessage } from '~/models'
import { relationshipsStore } from '~/store'

@Component
export default class Item extends Vue {
  @Prop({ type: Object })
  message!: ChannelMessage

  display = false

  get hidden(): boolean {
    return relationshipsStore.blockedPeerIds.includes(this.message.user.id)
  }

  unlock() {
    this.display = true
  }

  mounted() {
    this.display = !this.hidden
  }
}
</script>

<style scoped>
  .break {
    word-break: break-all;
  }
</style>
