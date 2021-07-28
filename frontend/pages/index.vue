<template>
  <v-main class="fill-height" style="overflow: scroll">
    <v-row justify="center" align="center">
      <v-col justify="center" align="center">
        <p class="text-center ma-10" style="font-size: 40px">
          ft_transcendence
        </p>
        <v-img
          max-height="600"
          max-width="1000"
          :src="require('@/assets/intro.gif')"
          class="mt-12 mb-6"
        ></v-img>
        <div class="text-center">
          <div>
            <v-dialog v-model="dialog" width="500" overly-opacity="3">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="ma-10"
                  dark
                  style="min-width: 200px"
                  v-bind="attrs"
                  v-on="on"
                >
                  How to play
                  <v-icon dark right> mdi-help-circle </v-icon>
                </v-btn>
              </template>

              <v-card>
                <v-card-title> Press up and down arrows to move your pad  </v-card-title>

                <v-card-text>
                  A small ball moves across the screen, bouncing off the top
                  and bottom ledges, and the two players each control a pad,
                  sliding it vertically between the ends of the screen using
                  the controls. If the ball hits the pad, it bounces back to
                  the other player. If it misses the pad, the other player
                  scores a point. The ball bounces in different ways depending
                  on how it hits the pad.
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialog = false">
                    close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn
              v-if="friends.length"
              to="/direct-messages"
              class="ma-10"
              style="min-width: 200px"
            >
              My friends
              <v-icon dark right> mdi-human-greeting </v-icon>
            </v-btn>

            <v-btn
              v-else
              to="/users"
              class="ma-10"
              dark
              style="min-width: 200px"
            >
              Find new friends
              <v-icon dark right> mdi-human-greeting </v-icon>
            </v-btn>

            <v-btn to="/channels" class="ma-10" dark style="min-width: 200px">
              socialize
              <v-icon dark right> mdi-message </v-icon>
            </v-btn>
          </div>

          <div>
            <v-btn
              to="/games"
              x-large
              class="ma-10"
              color="primary"
              dark
              style="min-width: 300px"
            >
              Quick play
              <v-icon dark>mdi-play-circle</v-icon>
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { RelationshipType, User } from '~/models'
import { relationshipsStore, socketStore } from '~/store'

@Component
export default class Page extends Vue {
  dialog = false

  get friends() {
    return relationshipsStore.list.filter(
      (x) => x.type === RelationshipType.FRIEND
    )
  }
}
</script>
