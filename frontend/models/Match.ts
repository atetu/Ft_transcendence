import { User } from './User'

export interface Match {
  id: number
  player1: User
  player2: User
  score1: number
  score2: number
  winner: User
}
