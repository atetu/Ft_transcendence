import * as socketio from "socket.io";
import { Socket } from "socket.io";
import Container, { Inject, Service } from "typedi";
import { isUndefined } from "util";
import PendingGame from "../entities/PendingGame";
import User from "../entities/User";
import Game from "../game/Game";
import SocketService from "./SocketService";

@Service()
export default class GameService {
  private repository: { [key: string]: Game } = {};
  private players: { [key: number]: Game } = {};

  constructor(
    @Inject()
    private readonly socketService: SocketService
  ) {}

  private incrementalId = 0;

  public findByUser(user: User) {
    return this.players[user.id];
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

  public start(first: Socket, second: Socket, pendingGame?: PendingGame): Game {
    const io = Container.get(socketio.Server);

    const game = new Game(first, second, pendingGame?.settings);
    this.provideId(game);

    first.join(game.toRoom());
    second.join(game.toRoom());

    this.save(game);

    game.start();
    io.emit("game_status_join", game.id);

    return game;
  }

  public findById(id: number) {
    return this.repository[id];
  }

  public save(game: Game): Game {
    if (!game.id) {
      this.provideId(game);
    }

    this.repository[game.id] = game;
    for (const player of game.players) {
      this.socketService.playingUsers.onJoin(player.socket);
      this.players[player.user.id] = game;
    }

    return game;
  }

  public delete(game: Game): void {
    if (!game.id) {
      throw new Error("cannot delete game without an id");
    }

    delete this.repository[game.id];

    for (const player of game.players) {
      this.socketService.playingUsers.onQuit(player.socket);
      delete this.players[player.user.id];
    }
  }

  private provideId(game: Game): void {
    if (game.id) {
      throw new Error("game already have an id");
    }

    game.id = ++this.incrementalId;
  }

  public gameDisconnect(player: User) {
    const io = Container.get(socketio.Server);
    const game = this.findByUser(player);

    if (!game) {
      return {};
    }
    delete this.players[player.id];
    io.emit("client_playing_quit", player.id);

    let ret = game.disconnect(player);
    console.log("RET: " + ret);
    if (ret === true) io.emit("game_status_quit", game.id);

    return { game: game, ret: ret };
  }
}
