import { Socket } from "socket.io";
import { Inject, Service } from "typedi";
import Game from "../game/Game";
import GameService from "./GameService";

@Service()
export default class MatchMakingService {
  private sockets: Socket[] = [];

  constructor(
    @Inject()
    private gameService: GameService
  ) {}

  private pop2(): [Socket, Socket] {
    return [this.sockets.shift(), this.sockets.shift()];
  }

  private contains(socket: Socket) {
    return this.sockets.some((x) => x.data.user.id === socket.data.user.id);
  }

  add(socket: Socket): Game | null {
    if (!this.contains(socket)) {
      this.sockets.push(socket);

      if (this.sockets.length >= 2) {
        const [first, second] = this.pop2();

        return this.gameService.start(first, second);
      }
    }

    return null;
  }
}
