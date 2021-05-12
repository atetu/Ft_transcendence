<template>
  <page-loading />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  layout: 'empty',
  validate({ params, store }) {
    const { provider } = params

    return provider in store.state.auth.providers
  },
})
export default class Callback extends Vue {
  profile: any = null

  mounted() {
    if (window.opener) {
      window.opener.postMessage('fetching', '*')

      this.$axios
        .get(this.callbackUrl, {
          params: {
            code: this.code,
          },
        })
        .then(async (response) => {
          const { accessToken, refreshToken } = response.data.user

          await this.$store.dispatch('auth/updateTokens', {
            accessToken,
            refreshToken,
          })

          await this.$store.dispatch('auth/fetch')

          window.opener.postMessage('success', '*')
        })
        .catch((_error) => {
          window.opener.postMessage(`error`, '*')
        })
        .then(() => {
          setTimeout(() => window.close(), 10)
        })
    } else {
      this.$router.push('/auth')
    }
  }

  get provider() {
    return this.$route.params.provider
  }

  get code() {
    return this.$route.query.code
  }

  get callbackUrl() {
    return `/auth/oauth/${this.provider}/callback`
  }
}
</script>
