<template>
  <v-main class="fill-height">
    <v-row class="fill-height ma-2" style="overflow: auto">
      <v-col cols="6">
        <v-card>
          <v-card-title>auth</v-card-title>
          <v-card-actions>
            <v-btn
              color="primary"
              @click="$store.dispatch('auth/refreshTokens')"
            >
              refresh tokens
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-card-title>store</v-card-title>
          <v-card-text>
            <code style="display: block">
              <pre style="white-space: pre-wrap; word-wrap: break-word">{{
                JSON.stringify($store.state, null, 4)
              }}</pre>
            </code>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>
