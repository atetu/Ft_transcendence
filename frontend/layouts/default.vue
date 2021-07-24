<template>
  <v-app dark :class="classes">
    <system-bar />

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
import { Socket } from 'vue-socket.io-extended'
import { AchievementProgress } from '~/models'
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
      title: 'social plaza',
      icon: 'human-greeting-proximity',
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

  @Socket('achievement_unlock')
  onAchievementUnlock(progress: AchievementProgress) {
    this.$dialog.message.success(`Unlocked: ${progress.achievement.name}`, {
      dismissible: true,
    })
  }
}
</script>
