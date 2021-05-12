import { Plugin } from '@nuxt/types'

const plugin: Plugin = ({ $axios, store, redirect }) => {
  $axios.defaults.baseURL = window.location.origin + '/api/' // 'http://127.0.0.1:3001/' // window.location.origin + '/api/'

  $axios.interceptors.request.use((config) => {
    const accessToken = store.state.auth.accessToken

    if (accessToken) {
      config.headers.common.Authorization = `Bearer ${accessToken}`
    }

    return config
  })

  $axios.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      if (
        error.response.status === 401 &&
        !error.response.data?.authenticated /* if admin only page */
      ) {
        let newTokens

        try {
          newTokens = (
            await $axios.$post('/auth/refresh-token', {
              accessToken: store.state.auth.accessToken,
              refreshToken: store.state.auth.refreshToken,
            })
          ).tokens
        } catch (error2) {
          console.error(
            'Another error has happen when trying to refresh the tokens',
            error2
          )

          if (error2.response?.data?.message === 'invalid access token') {
            redirect('/auth')
          }

          return Promise.reject(error)
        }

        const { accessToken, refreshToken } = newTokens

        await store.dispatch('auth/updateTokens', {
          accessToken,
          refreshToken,
        })

        error.config.headers.Authorization = `Bearer ${accessToken}`

        return $axios.request(error.config)
      }

      return Promise.reject(error)
    }
  )
}

export default plugin
