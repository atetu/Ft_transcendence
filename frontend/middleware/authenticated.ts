import { Middleware } from '@nuxt/types'

const middleware: Middleware = ({ redirect, store }) => {
  console.log(store.getters['auth/isAuthenticated'])

  if (!store.getters['auth/isAuthenticated']) {
    return redirect('/auth')
  }
}

export default middleware
