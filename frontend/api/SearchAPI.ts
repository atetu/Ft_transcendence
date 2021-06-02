import { $axios } from '../utils/api'
import { User } from '~/models'

export default class SearchAPI {
  static users(query: string): Promise<Array<User>> {
    return $axios.get(`/search/users`, {
      params: {
        query,
      },
    })
  }
}
