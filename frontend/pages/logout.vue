<template>
  <page-loading title="logging out..." />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { authModule } from '~/store/auth/const'

@Component
export default class Logout extends Vue {
  @authModule.Action('logout')
  logout!: () => void

  mounted() {
    setTimeout(() => {
      this.logout()
      this.$router.push('/auth')
    }, 200)
  }
}
</script>
