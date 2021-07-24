import { User } from './User'

export enum Side {
  LEFT,
  RIGHT,
}

export interface Player {
  user: User
  score: number
  connected: boolean
}

export interface Game {
  id: number
  player: {
    [key in Side]: Player
  }
  paddle: {
    [key in Side]: {
      x: number
      y: number
      width: number
      height: number
    }
  }
  ball: {
    x: number
    y: number
    radius: number
  }
  countdown: number
  sprite: any
  factor: any
}
