import { AuthProvider } from '~/models'

export interface AuthState {
  providers: { [key: string]: AuthProvider }
  accessToken: string | null
  refreshToken: string | null
}
