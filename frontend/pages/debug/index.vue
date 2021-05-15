<template>
  <v-main class="fill-height">
    <v-btn @click="$store.dispatch('auth/refreshTokens')">
      refresh tokens
    </v-btn>

    <br />

    {{ $store.state.socket }}
  </v-main>
</template>
