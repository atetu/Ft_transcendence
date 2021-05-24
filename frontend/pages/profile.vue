<template>
  <v-main class="fill-height">
    <v-row class="ma-4">
      <v-col cols="12" md="3">
        <v-card class="pa-2" outlined>
          <v-row justify="center" align="center">
            <v-avatar color="indigo" size="128" class="mt-8 mb-6">
              <v-icon size="72" dark> mdi-account-circle </v-icon>
            </v-avatar>
          </v-row>
          <v-card-title class="headline">
            <v-spacer />
            {{ user.username }}
            <v-spacer />
          </v-card-title>
          <v-card-subtitle class="text-center">
            joined <br />
            15 05 2021
          </v-card-subtitle>
          <v-col cols="12">
            <v-row>
              <v-col cols="12">
                <v-btn depressed block color="primary">
                  ask game
                  <v-icon right>mdi-sword-cross</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row justify="center" align="center">
              <v-col cols="12" xl="6">
                <v-btn depressed block color="primary">
                  friend
                  <v-icon right>mdi-account-plus</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" xl="6">
                <v-btn outlined block color="primary">
                  message
                  <v-icon right>mdi-message-arrow-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-card>
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
        <v-card outlined tile>
          <v-card-title>
            match history ueuyuiyrpup uywpry ppuyru ehfjkkdssncjkb
            0002654455464465456465 8979==/745132565
            65565656556565656565656446546546546545645456465456
          </v-card-title>
        </v-card>
      </v-col>

      <v-col cols="3">
        <v-card class="pa-2" outlined tile> achievements </v-card>
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

import { authModule } from '~/store/auth/const'

import { User } from '~/models'

@Component
export default class Dot extends Vue {
  @authModule.State('user')
  user!: User

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
}
</script>
