import * as socketio from "socket.io";
import { Socket } from "socket.io";
import Container, { Inject, Service } from "typedi";
import { isObject } from "util";
import PendingGame from "../entities/PendingGame";
import User from "../entities/User";
import Game from "../game/Game";
import GameService from "./GameService";
import SocketService from "./SocketService";
import PendingGameRepository from "../repositories/PendingGameRepository";
import ChannelMessageService from "./ChannelMessageService";
import DirectMessageService from "./DirectMessageService";
import { InjectRepository } from "typeorm-typedi-extensions";
import ChannelMessage from "../entities/ChannelMessage";
import Channel from "../entities/Channel";
import config from "../config";

function getUserId(socket: Socket): number {
  return socket.data.user.id;
}

class Room {
  static UNLIMITED = -1;

  private awaitings: Array<Socket>;

  constructor(public readonly id: number) {
    this.awaitings = [];
  }

  public accept(socket: Socket): boolean {
    throw new Error("not implemented");
  }

  protected add(socket: Socket): void {
    if (this.contains(socket)) {
      return;
    }

    this.awaitings.push(socket);
  }

  public remove(socket: Socket): void {
    const index = this.awaitings.findIndex((x) => x.id === socket.id);
    if (index !== -1) {
      this.awaitings.splice(index, 1);
    }
  }

  protected contains(socket: Socket) {
    const userId = getUserId(socket);

    return !!this.awaitings.find((x) => getUserId(x) === userId);
  }

  public pop1(): Socket {
    return this.awaitings.shift();
  }

  public pop2(): [Socket, Socket] {
    return [this.awaitings.shift(), this.awaitings.shift()];
  }

  public size(): number {
    return this.awaitings.length;
  }

  public isEmpty(): boolean {
    return this.awaitings.length === 0;
  }
}

class MatchmakingRoom extends Room {
  constructor(id: number) {
    super(id);
  }

  public accept(socket: Socket) {
    this.add(socket);

    return true;
  }
}

class PrivateRoom extends Room {
  constructor(id: number, private readonly users: Array<User>) {
    super(id);
  }

  public accept(socket: Socket) {
    const userId = getUserId(socket);

    if (!this.users.find((x) => x.id === userId)) {
      return false;
    }

    this.add(socket);

    return true;
  }
}

class Gatekeeper {
  private readonly roomByUser: { [key: number]: Room };
  private readonly rooms: { [key: number]: Room };

  constructor() {
    this.roomByUser = {};
    this.rooms = {};
  }

  public add(socket: Socket, pendingGame?: PendingGame): Room {
    const userId = getUserId(socket);

    if (this.getRoomOfUser(socket.data.user)) {
      throw new Error("already in room");
    }

    const room = this.getRoom(pendingGame);

    if (room.accept(socket)) {
      this.roomByUser[userId] = room;

      return room;
    }

    if (room.isEmpty()) {
      this.destroyRoom(room);
    }

    return null;
  }

  public pop1(room: Room): Socket {
    const a = room.pop1();

    this.remove(a);

    return a;
  }

  public pop2(room: Room): [Socket, Socket] {
    const [a, b] = room.pop2();

    this.remove(a);
    this.remove(b);

    return [a, b];
  }

  public destroyRoom(room: Room) {
    delete this.rooms[room.id];
  }

  public remove(socket: Socket): void {
    const userId = getUserId(socket);
    const room = this.getRoomOfUser(socket.data.user);

    if (room) {
      room.remove(socket);

      delete this.roomByUser[userId];
    }
  }

  private getRoomOfUser(user: User): Room | null {
    return this.roomByUser[user.id] || null;
  }

  private getRoom(pendingGame?: PendingGame): Room {
    const id = pendingGame?.id || 0;

    const room = this.rooms[id];
    if (room) {
      return room;
    }

    return (this.rooms[id] = this.createRoom(id, pendingGame));
  }

  private createRoom(id: number, pendingGame?: PendingGame): Room {
    if (pendingGame) {
      return new PrivateRoom(id, [pendingGame.user, pendingGame.peer]);
    }

    return new MatchmakingRoom(id);
  }
}

@Service()
export default class MatchMakingService {
  private gatekeeper: Gatekeeper;

  constructor(
    @Inject()
    private gameService: GameService,

    @Inject()
    private socketService: SocketService,

    @InjectRepository()
    private readonly repository: PendingGameRepository,

    @Inject()
    private readonly directMessageService: DirectMessageService,

    @Inject()
    private readonly channelMessageService: ChannelMessageService
  ) {
    this.gatekeeper = new Gatekeeper();
  }

  async add(socket: Socket, pendingGame?: PendingGame): Promise<Game> {
    const room = this.gatekeeper.add(socket, pendingGame);

    let sockets: [Socket, Socket];

    if (config.MATCHMAKING_ONLY_ONE) {
      if (!room || room.size() < 1) {
        return null;
      }

      const first = this.gatekeeper.pop1(room);
      sockets = [first, first];
    } else {
      if (!room || room.size() < 2) {
        return null;
      }

      const [first, second] = this.gatekeeper.pop2(room);
      sockets = [first, second];
    }

    if (room.isEmpty()) {
      this.gatekeeper.destroyRoom(room);
    }

    const game = this.gameService.start(...sockets, pendingGame);

    this.socketService.broadcastGameStarting(game);

    return game;
  }

  remove(socket: Socket, id?: number) {
    this.gatekeeper.remove(socket); // TODO use id
  }
}
