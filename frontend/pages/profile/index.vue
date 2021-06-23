<template>
  <v-main class="fill-height">
    <v-row class="ma-4">
      <v-col cols="12" md="3">
        <user-profile-card-info :user="user"></user-profile-card-info>
        <v-card class="pa-2 mt-4" outlined>
          <v-card-title>
            <v-spacer />
            statistics
            <v-spacer />
          </v-card-title>
          <v-list>
            <v-list-item v-for="statistic in statistics" :key="statistic.name">
              <v-list-item-content>
                <v-list-item-title>{{ statistic.name }}</v-list-item-title>
              </v-list-item-content>

              <v-list-item-icon>
                {{ statistic.value }}
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="6">
        <user-profile-card-matches :user="user" />
      </v-col>

      <v-col cols="3">
        <user-profile-card-last-achievements :user="user" />
        <v-card class="pa-2 mt-4" outlined tile>
          friends
          <v-icon right>mdi-account-group</v-icon>
          <v-btn outlined block color="red">
            block
            <v-icon right>mdi-account-cancel</v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { User } from '~/models'
import { authStore } from '~/store'

@Component
export default class Dot extends Vue {
  statistics = [
    {
      name: 'games won',
      value: 5,
    },
    {
      name: 'games lost',
      value: 9,
    },
    {
      name: 'games',
      value: 14,
    },
  ]

  achievements = [
    {
      name: 'grand chelem 1',
      value: 0,
      max: 10,
    },
    {
      name: 'grand chelem 2',
      value: 0,
      max: 50,
    },
    {
      name: 'grand chelem 3',
      value: 0,
      max: 100,
    },
    {
      name: 'community member',
      value: 0,
      max: 20,
    },
  ]

  get user(): User | null {
    return authStore.user
  }
}
</script>
