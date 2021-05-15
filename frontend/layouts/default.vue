<template>
  <v-app dark :class="classes">
    <v-system-bar app>
      ft-transcendence
      <v-spacer />
      <v-icon v-if="$socket.connected" color="green">mdi-power-plug</v-icon>
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
    {
      title: 'logout',
      icon: 'logout',
      url: '/logout',
    },
  ]

  get drawer(): boolean {
    return this.$store.state.ui.drawer
  }

  set drawer(value) {
    this.$store.commit('ui/setDrawer', value)
  }

  get classes(): object {
    const isDark = this.$vuetify.theme.dark

    return {
      dark: isDark,
      light: !isDark,
      'mini-drawer-open': this.drawer,
    }
  }
}
</script>
