<template>
  <v-main class="fill-height">
    <v-row justify="center" align="center">
      <v-col justify="center" align="center">
        <p class="text-center ma-10" style="font-size: 40px">
          ft_transcendence
        </p>
        <v-img
          lazy-src="https://media.giphy.com/media/4D7oYYeaW6pZC/giphy.gif"
          max-height="600"
          max-width="1000"
          src="https://media.giphy.com/media/4D7oYYeaW6pZC/giphy.gif"
          class="mt-12 mb-6"
        ></v-img>
        <div class="text-center">
          <div>
            <v-btn class="ma-10" dark style="min-width: 200px">
              How to play
              <v-icon dark right> mdi-help-circle </v-icon>
            </v-btn>

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

            <v-btn class="ma-10" dark style="min-width: 200px">
              socialize
              <v-icon dark right> mdi-message </v-icon>
            </v-btn>
          </div>

          <div>
            <v-btn
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
  get friends() {
    return relationshipsStore.list.filter(
      (x) => x.type === RelationshipType.FRIEND
    )
  }
}
</script>
