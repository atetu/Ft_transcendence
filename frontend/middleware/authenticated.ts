import { Middleware } from '@nuxt/types'

const middleware: Middleware = ({ redirect, store }) => {
  if (!store.getters['auth/isAuthenticated']) {
    return redirect('/auth')
  }
}

export default middleware
