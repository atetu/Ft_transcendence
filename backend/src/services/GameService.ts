import Game from "../game/Game";

export default class GameServce {
  private games: { [key: string]: Game }


  public gameConnect({ gameId }, callback) {
    let game = this.games[gameId]

    if (game === undefined) {
      game = this.games[gameId] = new Game()
    }

    game.connected += 1

    if (game.connected === 2) {
      game.start()
    }
  }

  public gameMove({ gameId, playerId, newY }) {
    const game = this.games[gameId]

    if (game=== undefined) {
      return 
    }

    game.movePaddle(playerId, newY)
  }

}