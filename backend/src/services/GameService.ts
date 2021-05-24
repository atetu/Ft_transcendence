import { Service } from "typedi";
import { PrimaryColumnCannotBeNullableError } from "typeorm";
import Game from "../game/Game";


@Service()
export default class GameService {
  private games: { [key: string]: Game } = {}


  public gameConnect(gameId, playerId) {
    console.log("here")
    let game = this.games["" + gameId]

    if (game === undefined) {
      game = this.games["" + gameId] = new Game(gameId)
    }

    game.connected += 1
    if (game.connected === 1)
      game.setPlayer(1, playerId)
    else if (game.connected === 2)
      game.setPlayer(2, playerId)

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