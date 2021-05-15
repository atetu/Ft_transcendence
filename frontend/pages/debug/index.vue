<template>
  <v-main class="fill-height">
    <v-btn @click="$store.dispatch('auth/refreshTokens')">
      refresh tokens
    </v-btn>
  </v-main>
</template>
