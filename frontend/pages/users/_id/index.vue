<template>
  <page-loading v-if="$fetchState.pending" />
  <page-error
    v-else-if="$fetchState.error"
    :error="$fetchState.error"
    @click="$fetch()"
  />
  <v-main v-else class="fill-height" style="overflow: auto">
    <v-row class="ma-2">
      <v-col cols="6">
        <v-card>
          <v-card-title>info</v-card-title>
          <v-card-text>
            <code style="display: block">
              <pre>{{ JSON.stringify(user, null, 4) }}</pre>
            </code>
          </v-card-text>
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
export default class Loading extends Vue {
  user: User | null = null

  get id(): number {
    return parseInt(this.$route.params.id)
  }

  async fetch() {
    this.user = await API.Users.show(this.id)
  }
}
</script>
