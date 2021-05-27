<template>
  <page-loading title="Waiting room..." />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator' // propre a nuxt
import { Socket } from 'vue-socket.io-extended'

@Component
export default class WaitingRoom extends Vue {

 mounted() {
   console.log('ici')
    this.$socket.client.emit('waiting_room')
 } 
  @Socket('game_starting')
  launchGame(data: any)
  {
    const { player1, player2, gameId } = data
    console.log('launch game')
    this.$router.push('/game/' + gameId)

  }

}
</script>