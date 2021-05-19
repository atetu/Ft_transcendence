<template>
  <div class="pa-4 fill-height" style="overflow-y: scroll">
    <v-app-bar app clipped-right>
      <v-toolbar-title> {{ $t('channel.create') }} </v-toolbar-title>
    </v-app-bar>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <channel-settings-edit />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Index extends Vue {}
</script>
