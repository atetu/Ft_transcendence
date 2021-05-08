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
import { Component, Vue } from 'nuxt-property-decorator'

interface Link {
  icon: string
  title: string
  url: string
}

@Component
export default class Default extends Vue {
  public links: Link[] = [
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
  ]

  get drawer(): boolean {
    return this.$store.state.ui.drawer
  }

  set drawer(value) {
    this.$store.commit('ui/setDrawer', value)
  }
}
</script>
