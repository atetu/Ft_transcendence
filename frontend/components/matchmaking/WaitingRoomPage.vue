<template>
  <page-loading v-if="loading" title="Joining waiting room..." />
  <page-error v-else-if="error" :error="error" @click="tryJoin" />
  <page-loading v-else-if="joined" title="Waiting for opponent..." />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Socket } from 'vue-socket.io-extended'
import { PendingGame } from '~/models'
import { Game } from '~/models/Game'

@Component
export default class Page extends Vue {
  @Prop()
  pendingGame!: PendingGame

  loading = false
  joined = false
  error: any = null

  get id() {
    return this.pendingGame?.id || 0
  }

  mounted() {
    this.tryJoin()
  }

  tryJoin() {
    this.loading = true
    this.error = null

    this.$socket.client.emit(
      'waiting_room_join',
      {
        id: this.id,
      },
      (error: any) => {
        if (error) {
          this.error = error
        } else {
          this.joined = true
        }

        this.loading = false
      }
    )
  }

  @Socket('game_connect')
  onGameStarting(data: Game) {
    const { id } = data

    this.joined = true
    this.$router.push({ path: `/games/${id}` })
  }

  destroyed() {
    if (!this.joined) {
      this.$socket.client.emit('waiting_room_leave', {
        id: this.id,
      })
    }
  }
}
</script>
