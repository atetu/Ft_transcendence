<template>
  <div>
    <user-avatar :user="player.user" />
    <p class="login">{{ player.user.username }}</p>
    <p class="score">
      {{ player.score }}
      <small v-if="max">/ {{ max }}</small>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Player } from '~/models/Game'

@Component
export default class Score extends Vue {
  @Prop()
  player!: Player

  @Prop()
  max!: Number
}
</script>

<style>
  .score {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 80px;
  }

  .login {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 20px;
  }
</style>
