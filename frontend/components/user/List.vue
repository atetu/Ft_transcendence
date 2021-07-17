<template>
  <v-list>
    <user-item v-for="user in users" :key="user.id" :user="user" />
  </v-list>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { User } from '~/models'

@Component
export default class List extends Vue {
  @Prop()
  users!: User[]
}
</script>
