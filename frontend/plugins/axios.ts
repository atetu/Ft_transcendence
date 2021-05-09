import { AxiosInstance } from 'axios'

export default function ({ $axios }: { $axios: AxiosInstance }) {
  $axios.defaults.baseURL = 'http://127.0.0.1:3001/' // window.location.origin + '/api/'
}
