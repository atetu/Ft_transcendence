import * as socketio from "socket.io";
import { Socket } from "socket.io";
import Container, { Service } from "typedi";
import { isObject } from "util";
import Channel from "../entities/Channel";
import ChannelMessage from "../entities/ChannelMessage";
import ChannelUser from "../entities/ChannelUser";
import User from "../entities/User";
import Game from "../game/Game";
import ChannelService from "./ChannelService";
import GameService from "./GameService";
import MatchMakingService from "./MatchMakingService";

export type Callback = (err: Error, answer: any) => void;

export enum ClientEvent {
  CONNECTED_JOIN = "client_connected_join",
  CONNECTED_QUIT = "client_connected_quit",
  CONNECTED_LIST = "client_connected_list",
}

export enum ChannelEvent {
  CONNECT = "channel_connect",
  MESSAGE = "channel_message",
  USER_JOIN = "channel_user_join",
  USER_LEAVE = "channel_user_leave",
  USER_UPDATE = "channel_user_update",
  OWNER_TRANSFER = "channel_owner_transfer",
  NEW = "channel_new",
  ADD = "channel_add",
}

export enum DirectMessageEvent {
  ADD = "direct_message_add",
}

export enum GameEvent {
  CONNECT = "game_connect",
  MOVE = "game_move",
  STARTING = "game_starting",
}

export enum MatchMakingEvent {
  WAITING_ROOM = "waiting_room",
}

export type Event = ClientEvent | ChannelEvent | DirectMessageEvent | GameEvent;

@Service()
export default class SocketService {
  private gameService = Container.get(GameService);
  private matchMakingService = Container.get(MatchMakingService);

  private channelService = Container.get(ChannelService);

  get io() {
    return Container.get(socketio.Server);
  }

  connectedUserSessionCounts: { [key: number]: number } = {};

  get connectedUserIds() {
    return Object.keys(this.connectedUserSessionCounts);
  }

  onConnect(socket: Socket) {
    const { user } = socket.data as { user: User };
    const { id } = user;

    if (this.connectedUserSessionCounts[id]) {
      this.connectedUserSessionCounts[id] += 1;
    } else {
      socket.broadcast.emit(ClientEvent.CONNECTED_JOIN, id);

      this.connectedUserSessionCounts[id] = 1;
    }

    socket.emit(ClientEvent.CONNECTED_LIST, this.connectedUserIds);

    socket.join(user.toRoom());
  }

  onDisconnect(socket: any) {
    const { id } = socket.data.user;

    if (this.connectedUserSessionCounts[id]) {
      const now = (this.connectedUserSessionCounts[id] -= 1);

      if (now === 0) {
        socket.broadcast.emit(ClientEvent.CONNECTED_QUIT, id);

        delete this.connectedUserSessionCounts[id];
      }
    }
  }

  async askChannelConnect(socket: Socket, body: any, callback: Callback) {
    const { currentChannelRoom } = socket.data;

    try {
      this.ensureBody(body);

      const { channelId } = body;

      const channel = await this.channelService.findById(channelId);

      if (!channel) {
        throw new Error("channel not found");
      }

      if (currentChannelRoom !== undefined) {
        socket.leave(currentChannelRoom);
      }

      const newChannelRoom = channel.toRoom();

      socket.join(newChannelRoom);
      socket.data.currentChannelRoom = newChannelRoom;

      callback(null, 1);
    } catch (error) {
      callback(error, null);
    }
  }

  public broadcastChannelMessage(message: ChannelMessage) {
    const channel = message.channel;

    this.broadcastToChannel(channel, ChannelEvent.MESSAGE, message);
  }

  public broadcastChannelUserJoin(channelUser: ChannelUser) {
    const channel = channelUser.channel;

    this.broadcastToChannel(channel, ChannelEvent.USER_JOIN, channelUser);
  }

  public broadcastChannelUserLeave(channelUser: ChannelUser) {
    const channel = channelUser.channel;

    this.broadcastToChannel(channel, ChannelEvent.USER_LEAVE, channelUser);
  }

  public broadcastChannelUserUpdate(channelUser: ChannelUser) {
    const channel = channelUser.channel;

    this.broadcastToChannel(channel, ChannelEvent.USER_UPDATE, channelUser);
  }

  public broadcastChannelOwnerTransfer(channel: Channel) {
    this.broadcastToChannel(
      channel,
      ChannelEvent.OWNER_TRANSFER,
      channel.owner
    );
  }

  public broadcastNewChannel(channel: Channel) {
    // TODO need rework, like only for publics?
    this.io.emit(ChannelEvent.NEW, channel.toJSON());
  }

  public notifyAdded(user: User, channel: Channel) {
    const event = channel.isDirect()
      ? DirectMessageEvent.ADD
      : ChannelEvent.ADD;

    this.broadcastToUser(user, event, channel);
  }

  async askMatchMaking(socket: Socket) {
    const game: Game | null = this.matchMakingService.add(socket);

    if (game) {
      this.broadcastToGame(game, GameEvent.STARTING, {
        player1: game.player1.id,
        player2: game.player2.id,
        gameId: game.id,
      });
    }
  }

  async askGameConnect(socket: Socket, body: any, callback: Callback) {
    try {
      this.ensureBody(body);

      const { gameId } = body;

      const game = this.gameService.findById(gameId);

      if (!game) {
        throw new Error("game not found");
      }

      callback(null, {
        player1: game.player1,
        player2: game.player2,
      });
    } catch (error) {
      callback(error, null);
    }
  }

  async askGameMove(socket: Socket, body: any, callback: Callback) {
    try {
      this.ensureBody(body);

      const { gameId, y } = body;

      if ([gameId, y].includes(undefined)) {
        return callback(new Error("invalid value"), null);
      }

      const success = this.gameService.gameMove(gameId, socket.data.user, y);

      if (!success) {
        throw new Error("invalid position");
      }

      callback(null, y);
    } catch (error) {
      callback(error, null);
    }
  }

  private broadcastToChannel(
    channel: Channel,
    event: ChannelEvent,
    message?: any
  ) {
    this.broadcastToRoom(channel.toRoom(), event, message);
  }

  private broadcastToGame(game: Game, event: GameEvent, message?: any) {
    this.broadcastToRoom(game.toRoom(), event, message);
  }

  private broadcastToUser(user: User, event: Event, message?: any) {
    this.broadcastToRoom(user.toRoom(), event, message);
  }

  private broadcastToRoom(room: string, event: Event, message?: any) {
    this.io.to(room).emit(event, message?.toJSON?.());
  }

  private ensureBody(body: any) {
    if (!body || !isObject(body)) {
      throw new Error("bad body");
    }
  }
}
