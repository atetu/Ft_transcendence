<template>
  <v-main class="fill-height">
    <v-list class="fill-height" three-line style="overflow: auto">
      <template v-for="user in users">
        <v-list-item :key="user.id">
          <v-list-item-avatar>
            <user-avatar :user="user" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.username }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.id }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { User } from '~/models'

@Component({
  async fetch() {
    const self: any = this

    // TODO
    self.users = await self.$axios.$get('/users')
  },
})
export default class Loading extends Vue {
  users: User[] = []
}
</script>
