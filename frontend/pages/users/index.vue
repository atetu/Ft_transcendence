<template>
  <v-main class="fill-height" style="overflow: auto">
    <v-row class="ma-2">
      <v-col cols="12">
        <v-card :loading="$fetchState.pending">
          <v-card-title>
            Users
            <v-spacer />
            <v-text-field
              v-model="filter"
              clearable
              solo
              outlined
              dense
              hide-details
              prepend-inner-icon="mdi-magnify"
              style="max-width: 200px"
              class="mr-4"
            />
            <v-btn icon :loading="$fetchState.pending" @click="$fetch">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text v-if="$fetchState.error">
            <v-alert type="error">
              Could not fetch users: {{ $fetchState.error }}
            </v-alert>
          </v-card-text>
          <user-list :users="users" :filter="filter" />
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { User } from '~/models'

@Component
export default class Page extends Vue {
  users: User[] = []
  filter = ''

  async fetch() {
    this.users = await this.$axios.$get('/users')
  }
}
</script>
