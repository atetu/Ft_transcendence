<template>
  <v-main class="fill-height" style="overflow: auto">
    <v-row class="ma-2">
      <v-col cols="12">
        <v-card>
          <v-card-title>Users</v-card-title>
          <v-list>
            <v-list-item
              v-for="user in users"
              :key="user.id"
              link
              :to="`/users/${user.id}`"
            >
              <v-list-item-avatar>
                <user-avatar :user="user" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ user.username }}
                  <v-icon v-if="user.admin" right>
                    mdi-account-supervisor
                  </v-icon>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import API from '~/api/API'
import { User } from '~/models'

@Component
export default class Page extends Vue {
  users: User[] = []

  async fetch() {
    this.users = await API.Users.index()
  }
}
</script>
