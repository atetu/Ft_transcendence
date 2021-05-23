<template>
  <v-card>
    <v-card-title>{{ name }}</v-card-title>
    <v-card-subtitle>{{ description }}</v-card-subtitle>
    <v-progress-linear :value="percentage" height="25">
      <small v-if="isUnlocked">{{ unlockedAt }}</small>
      <template v-else>
        <small v-if="isPercent">{{ percentage.toFixed(2) }}</small>
        <small v-else>
          {{ progress.value }} / {{ progress.achievement.max }}
        </small>
      </template>
    </v-progress-linear>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import { AchievementProgress } from '~/models'

@Component
export default class Page extends Vue {
  @Prop()
  progress!: AchievementProgress

  get name(): string {
    return this.progress.achievement.name
  }

  get description(): string {
    return this.progress.achievement.description
  }

  get isUnlocked(): boolean {
    return this.progress.unlocked
  }

  get unlockedAt(): string {
    return new Date(this.progress.unlockedAt as string).toLocaleString()
  }

  get isPercent(): boolean {
    return this.progress.achievement.percent
  }

  get percentage(): number {
    return (this.progress.value / this.progress.achievement.max) * 100
  }
}
</script>
