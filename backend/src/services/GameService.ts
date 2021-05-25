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
      console.log('created')
    }

    console.log(this.games)

    game.connected += 1
    if (game.connected === 1)
    {
      game.setPlayer(1, playerId)
    }
    else if (game.connected === 2)
      game.setPlayer(2, playerId)

    if (game.connected === 2) {
      game.start()
    }
    return (game)
  }

  public gameMove({ gameId, player, newY }) {
   
    const game = this.games["" + gameId]
    console.log('inside game move')
    if (game === undefined) {
      console.log('undefined')
      return (false)
    }
//  console.log('new Y ' + newY)
    return(game.movePaddle(player, newY))
  }

}