<template>
  <v-main class="fill-height">
    {{ user }}
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { authModule } from '~/store/auth/const'

import { User } from '~/models'

@Component
export default class Dot extends Vue {
  @authModule.State('user')
  user!: User
}
</script>
