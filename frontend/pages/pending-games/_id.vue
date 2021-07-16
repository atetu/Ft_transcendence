<template>
  <page-loading v-if="loading" title="Joining waiting room..." />
  <page-error v-else-if="error" :error="error" @click="tryJoin" />
  <page-loading v-else-if="joined" title="Waiting for opponent..." />
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component, Vue } from 'nuxt-property-decorator'
import { Socket } from 'vue-socket.io-extended'
import { PendingGame } from '~/models'

@Component
export default class Page extends Vue {
  loading = false
  joined = false
  error: any = null

  pendingGame!: PendingGame

  async asyncData({ params, $axios }: Context) {
    const { id } = params

    const pendingGame: PendingGame = await $axios.$get(`/pending-games/${id}`)

    return {
      pendingGame,
    }
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
        id: this.pendingGame.id,
      },
      (error: any) => {
        if (error) {
          this.error = error
          console.log(error)
        } else {
          this.joined = true
        }

        this.loading = false
      }
    )
  }

  @Socket('game_starting')
  onGameStarting(data: any) {
    console.log({ data })
    const { player1, player2, id } = data
    this.joined = true
    this.$router.push({ path: `/game/${id}` })
  }

  destroyed() {
    alert(this.joined)
    if (!this.joined) {
      this.$socket.client.emit('waiting_room_leave', {
        id: this.pendingGame.id,
      })
    }
  }
}
</script>
