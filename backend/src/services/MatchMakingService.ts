import { Socket } from "socket.io";
import { Inject, Service } from "typedi";
import { PrimaryColumnCannotBeNullableError } from "typeorm";
import { isObject } from "util";
import User from "../entities/User";
import Game from "../game/Game";
import ChannelUserService from "./ChannelUserService";
import UserService from "./UserService";


@Service()
export default class MatchMakingService {
  private socketList: Socket[] = [];
  private socketDic: { [key: string]: Socket } = {};
  public games: { [key: string]: Game } = {}

  constructor(
    @Inject()
    private userService: UserService
  ) {}

  setSocket() {
    let socket = this.socketList[0];
    this.socketList.shift();
    delete this.socketDic["" + socket.data.user.id];
    return socket;
  }

    addSocket(socket: Socket) {
    console.log('addSocket')
    let s = this.socketDic["" + socket.data.user.id];
    if (s === undefined) {
      this.socketList.push(socket);
      this.socketDic["" + socket.data.user.id] = socket;
    }
    if (this.socketList.length >= 2) {
      let socket1 = this.setSocket();
      let socket2 = this.setSocket();

      let game = new Game(socket1.data.user, socket2.data.user)
      this.games["" + game.id] = game
      socket1.join(game.toRoom());
      socket2.join(game.toRoom());
      return (game)
    }
    // player.id = await this.userService.findById(player.id)
  }
}
