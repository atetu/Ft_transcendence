import { Inject, Service } from "typedi";
import { PrimaryColumnCannotBeNullableError } from "typeorm";
import Game from "../game/Game";
import MatchMakingService from "./MatchMakingService";



@Service()
export default class GameService {
  private games: { [key: string]: Game } = {}

  constructor(
    @Inject()
    private matchMakingService: MatchMakingService
  ) {}


  public gameConnect(gameId) {
    // console.log("here")
    let game = this.matchMakingService.games["" + gameId]

    // if (game === undefined) {
    //   game = this.games["" + gameId]
    //   // game = this.games["" + gameId] = new Game(gameId)

    //   // console.log('created')
    // }

    // console.log(this.games)

    // game.connected += 1
    // // console.log('CONNECETED: ' + game.connected)
    // if (game.connected === 1)
    // {
    //   game.setPlayer(1, playerId)
    // }
    // else if (game.connected === 2)
    //   game.setPlayer(2, playerId)

    // if (game.connected === 2) {
    //   game.start()
    // }
    return (game)
  }

  public gameMove({ gameId, player, newY }) {
   
    console.log('game moooooove')
    const game = this.matchMakingService.games["" + gameId]
    // console.log('inside game move')
    if (game === undefined) {
      console.log('undefined')
      return (false)
    }
 console.log('new Y ' + newY)
    return(game.movePaddle(player, newY))
  }

}