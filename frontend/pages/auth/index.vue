<template>
  <v-main>
    <v-container fill-height fluid>
      <v-row align="center">
        <v-col align="center">
          <h1>ft-transcendence</h1>
          <div class="text-center mt-16" style="max-width: 400px">
            <v-alert v-if="state === 'error'" type="error">
              failed to authenticate
            </v-alert>
            <v-alert v-if="state === 'success'" type="info"> success </v-alert>
            <v-progress-linear v-if="loading" indeterminate />
            <v-btn
              v-for="(provider, key) in providers"
              :key="key"
              color="primary"
              block
              x-large
              class="my-2"
              :disabled="loading"
              @click="use(key)"
            >
              {{ provider.name }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { AuthProvider } from '~/models'

import { authModule } from '~/store/auth/const'

@Component({
  layout: 'empty',
  head() {
    return {
      title: 'Authentication',
    }
  },
})
export default class Index extends Vue {
  @authModule.State('providers')
  providers!: { [key: string]: AuthProvider }

  loading = false
  state: string | null = null

  use(key: string) {
    if (this.loading) {
      return
    }

    const provider = this.providers[key]

    this.state = null
    this.loading = true

    const onMessage = async (event: MessageEvent) => {
      let done = false

      switch (event.data) {
        case 'fetching': {
          console.log('fetching')

          break
        }

        case 'success': {
          console.log('success')

          await this.$store.dispatch('auth/restoreTokens')
          await this.$store.dispatch('auth/fetch')

          this.$router.push('/')

          done = true
          break
        }

        case 'error': {
          console.log('error')

          done = true
          break
        }

        default: {
          return
        }
      }

      this.state = event.data

      if (done) {
        this.loading = false
        window.removeEventListener('message', onMessage)
      }
    }

    window.addEventListener('message', onMessage)

    const width = provider.width
    const height = provider.height
    const left = Math.round(window.screenX + (window.outerWidth - width) / 2)
    const top = Math.round(window.screenY + (window.outerHeight - height) / 2.5)

    const url = `/api/auth/oauth/${key}`

    const childWindow = window.open(
      url,
      'LogIn',
      'width=' +
        width +
        ',height=' +
        height +
        ',left=' +
        left +
        ',top=' +
        top +
        ',toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0'
    )

    if (childWindow) {
      const timerId = setInterval(() => {
        if (childWindow.closed) {
          clearInterval(timerId)
          this.loading = false
        }
      }, 100)
    }
  }
}
</script>
