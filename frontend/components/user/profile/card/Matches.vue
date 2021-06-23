<template>
  <v-card outlined :loading="loading">
    <v-card-title>
      Matches
      <v-spacer />
      <v-btn icon :loading="loading" @click="refresh">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>
    <v-list>
      <match-empty v-if="!matches.length" />
      <match-list-item
        v-for="match in matches"
        :key="match.id"
        :user="user"
        :match="match"
      />
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Match, User } from '~/models'

@Component
export default class ComponentImpl extends Vue {
  @Prop()
  user!: User

  @Prop({ type: Array })
  matches!: Array<Match>

  @Prop({ type: Boolean })
  loading!: boolean

  refresh() {
    this.$emit('refresh')
  }
}
</script>
