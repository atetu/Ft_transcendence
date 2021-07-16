import { Socket } from "socket.io";
import { Service } from "typedi";
import User from "../entities/User";
import Game from "../game/Game";

@Service()
export default class GameService {
  private repository: { [key: string]: Game } = {};
  private players: { [key: number]: Game } = {};

  private incrementalId = 0;

  public findByUser(user: User) {

  }

  public gameMove(gameId: number, player: User, newY: number) {
    const game = this.findById(gameId);

    if (!game) {
      return false;
    }

    return game.movePaddle(player, newY);
  }

  public gameRestartWaitingRoom(gameId: number, player: User, option: any) {
    const game = this.findById(gameId);

    if (!game) {
      return false;
    }

    return game.restartWaitingRoom(player, option);
  }

  public start(first: Socket, second: Socket): Game {
    const game = new Game(first.data.user, second.data.user);

    this.provideId(game);

    first.join(game.toRoom());
    second.join(game.toRoom());

    this.save(game);

    game.start();

    return game;
  }

  public findById(id: number) {
    return this.repository[id];
  }

  private save(game: Game): Game {
    if (!game.id) {
      this.provideId(game);
    }

    this.repository[game.id] = game;

    return game;
  }

  private provideId(game: Game): void {
    if (game.id) {
      throw new Error("game already have an id");
    }

    game.id = ++this.incrementalId;
  }
}
