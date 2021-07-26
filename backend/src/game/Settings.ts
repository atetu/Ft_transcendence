export interface GameSettings {
  map: number;
  ballVelocity: number;
  paddleVelocity: number;
  nbGames: number;
}

export function defaults(): GameSettings {
  return {
    map: 0,
    paddleVelocity: 3,
    ballVelocity: 3,
    nbGames: 3,
  };
}
