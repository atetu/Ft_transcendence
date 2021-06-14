<template>
  <auth-first-step :user="user" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { User } from '~/models'

import { authModule } from '~/store/auth/const'

@Component({
  layout: 'empty',
  head() {
    return {
      title: 'First step',
    }
  },
})
export default class Page extends Vue {
  @authModule.State('user')
  user!: User
}
</script>
