import { Middleware } from '@nuxt/types'

const middleware: Middleware = ({ redirect }) => {
  return redirect('/auth')
}

export default middleware
