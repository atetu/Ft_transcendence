import { AxiosInstance } from 'axios'

export default function ({ $axios }: { $axios: AxiosInstance }) {
  $axios.defaults.baseURL = window.location.origin
}
