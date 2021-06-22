<template>
  <v-app dark :class="classes">
    <v-system-bar app>
      ft-transcendence
      <v-spacer />
      <template v-if="$socket.connected">
        {{ connectedCount }}
        <v-icon>mdi-account-group</v-icon>
        <v-icon color="green">mdi-power-plug</v-icon>
      </template>
      <v-icon v-else color="red">mdi-power-plug-off</v-icon>
    </v-system-bar>

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

    <nuxt style="height: 100vh" />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { socketStore, uiStore } from '~/store'

interface Link {
  icon: string
  title: string
  url: string
}

@Component({
  middleware: 'authenticated',
})
export default class Default extends Vue {
  public links: Link[] = [
    {
      title: 'home',
      icon: 'view-dashboard',
      url: '/',
    },
    {
      title: 'direct messages',
      icon: 'message',
      url: '/direct-messages',
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
      title: 'relationships',
      icon: 'account-group',
      url: '/relationships',
    },
    {
      title: 'achievements',
      icon: 'trophy-award',
      url: '/achievements',
    },
    {
      title: 'logout',
      icon: 'logout',
      url: '/logout',
    },
    {
      title: 'games',
      icon: 'controller-classic',
      url: '/games',
    },
    {
      title: 'debug',
      icon: 'developer-board',
      url: '/debug',
    },
  ]

  get drawer(): boolean {
    return uiStore.drawer
  }

  set drawer(value: boolean) {
    uiStore.setDrawer(value)
  }

  get classes(): object {
    const isDark = this.$vuetify.theme.dark

    return {
      dark: isDark,
      light: !isDark,
      'mini-drawer-open': this.drawer,
    }
  }

  get connectedCount() {
    return socketStore.connectedUserIds.length
  }
}
</script>
