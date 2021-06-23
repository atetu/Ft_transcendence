<template>
  <v-list-item :to="to">
    <v-list-item-avatar>
      <user-avatar :user="enemy" />
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>
        <span v-if="isWon" class="yellow--text">Won</span>
        <span v-else class="red--text">Lost</span>
        against {{ enemy.username }}
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ playerScore }} - {{ enemyScore }}
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-icon>
      <v-icon v-if="isWon" large color="yellow">mdi-emoticon-cool</v-icon>
      <v-icon v-else large color="red">mdi-emoticon-dead</v-icon>
    </v-list-item-icon>
  </v-list-item>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Match, User } from '~/models'

@Component
export default class Dot extends Vue {
  @Prop()
  user!: User

  @Prop()
  match!: Match

  get player(): User {
    if (this.match.player1.id === this.user.id) {
      return this.match.player1
    }

    return this.match.player2
  }

  get enemy(): User {
    if (this.match.player1.id === this.user.id) {
      return this.match.player2
    }

    return this.match.player1
  }

  get playerScore(): number {
    if (this.match.player1.id === this.user.id) {
      return this.match.score1
    }

    return this.match.score2
  }

  get enemyScore(): number {
    if (this.match.player1.id === this.user.id) {
      return this.match.score2
    }

    return this.match.score1
  }

  get isWon(): boolean {
    return this.match.winner.id === this.user.id
  }

  get to(): string {
    return `/users/${this.enemy.id}`
  }
}
</script>
