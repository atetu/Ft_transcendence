export interface User {
  id: number
  username: string
  email?: string
  admin?: boolean
  picture?: string
  doneFirstStep?: boolean
}
