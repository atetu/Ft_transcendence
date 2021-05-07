<template>
  <v-app dark>
    <v-system-bar app> ft-transcendence </v-system-bar>

    <v-navigation-drawer v-model="drawer" app fixed mini-variant>
      <navigation-profile-dot />

      <v-divider class="mx-3 my-5" />

      <navigation-dot
        v-for="(link, index) in links"
        :key="index"
        :title="link.title"
        :icon="link.icon"
        :url="link.url"
      />
    </v-navigation-drawer>

    <nuxt />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

interface Link {
  icon: string
  title: string
  url: string
}

export default Vue.extend({
  data: () => ({
    links: [
      {
        title: 'home',
        icon: 'view-dashboard',
        url: '/',
      },
      {
        title: 'channels',
        icon: 'forum',
        url: '/channels',
      },
      {
        title: 'users',
        icon: 'account-multiple',
        url: '/users',
      },
      {
        title: 'friends',
        icon: 'account-group',
        url: '/friends',
      },
      {
        title: 'guilds',
        icon: 'home-group',
        url: '/guilds',
      },
      {
        title: 'wars',
        icon: 'sword-cross',
        url: '/wars',
      },
    ] as Link[],
  }),
  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer
      },
      set(value) {
        return this.$store.commit('setDrawerState', value)
      },
    },
  },
})
</script>
