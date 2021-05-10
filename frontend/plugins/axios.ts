import { AxiosInstance } from 'axios'

export default function ({ $axios }: { $axios: AxiosInstance }) {
  $axios.defaults.baseURL = window.location.origin + '/api/' // 'http://127.0.0.1:3001/' // window.location.origin + '/api/'
}
