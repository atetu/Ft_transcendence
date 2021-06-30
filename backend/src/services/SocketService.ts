import * as socketio from "socket.io";
import { Socket } from "socket.io";
import Container, { Service } from "typedi";
import Channel from "../entities/Channel";
import ChannelMessage from "../entities/ChannelMessage";
import ChannelUser from "../entities/ChannelUser";
import User from "../entities/User";
import Game from "../game/Game";
import ChannelService from "./ChannelService";
import GameService from "./GameService";
import MatchMakingService from "./MatchMakingService";

@Service()
export default class SocketService {
  private gameService = Container.get(GameService);
  private matchMakingService = Container.get(MatchMakingService);

  private channelService = Container.get(ChannelService);

  connectedUserIds = {};

  constructor() {}

  // constructor() {
  //   const io = Container.get(socketio.Server)

  //   setInterval(() => {
  //     io.emit('client_connected_list', Object.keys(this.connectedUserIds))
  //   }, 8000)
  // }

  connect(socket: any) {
    const { user } = socket.data as { user: User };
    const { id } = user;

    if (this.connectedUserIds[id]) {
      this.connectedUserIds[id] += 1;
    } else {
      socket.broadcast.emit("client_connected_join", id);

      this.connectedUserIds[id] = 1;
    }

    socket.emit("client_connected_list", Object.keys(this.connectedUserIds));

    socket.join(user.toRoom());
  }

  disconnect(socket: any) {
    const { id } = socket.data.user;

    if (this.connectedUserIds[id]) {
      const now = (this.connectedUserIds[id] -= 1);

      if (now === 0) {
        socket.broadcast.emit("client_connected_quit", id);

        delete this.connectedUserIds[id];
      }
    }
  }

  async channelConnect(socket: any, body: any, callnack: any) {
    const { currentChannelRoom } = socket.data;
    const { channelId } = body;

    try {
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

      callnack(null, 1);
    } catch (error) {
      console.log(error);
      callnack(error, null);
    }
  }

  broadcastToChannel(channel: Channel, event: string, message: any) {
    const io = Container.get(socketio.Server);

    io.to(channel.toRoom()).emit(event, message?.toJSON());
  }

  broadcastChannelMessage(message: ChannelMessage) {
    const channel = message.channel;

    this.broadcastToChannel(channel, "channel_message", message);
  }

  async broadcastChannelUserJoin(channelUser: ChannelUser) {
    const channel = channelUser.channel;

    this.broadcastToChannel(channel, "channel_user_join", channelUser);
  }

  async broadcastChannelUserLeave(channelUser: ChannelUser) {
    const channel = channelUser.channel;

    this.broadcastToChannel(channel, "channel_user_leave", channelUser);
  }

  async broadcastChannelUserUpdate(channelUser: ChannelUser) {
    const channel = channelUser.channel;

    this.broadcastToChannel(channel, "channel_user_update", channelUser);
  }

  async broadcastChannelOwnerTransfer(channel: Channel) {
    this.broadcastToChannel(channel, "channel_owner_transfer", channel.owner);
  }

  async broadcastNewChannel(channel: Channel) {
    const io = Container.get(socketio.Server);

    io.emit("channel_new", channel.toJSON());
  }

  notifyAdded(user: User, channel: Channel) {
    const io = Container.get(socketio.Server);

    const event = channel.isDirect() ? 'direct_message_add' : 'channel_add'
    io.to(user.toRoom()).emit(event, channel.toJSON());
  }

  async gameConnect(socket, body: any, callback: any) {
    console.log("Game connect");
    const { gameId } = body;
    const io = Container.get(socketio.Server);

    const game = this.gameService.gameConnect(gameId);
    if (game) {
      callback(null, {
        player1: game.player1,
        player2: game.player2,
      });
    } else {
      callback(new Error("not enough players"));
    }
  }

  async gameMove(socket, body, callback) {
    console.log("Game move");
    const io = Container.get(socketio.Server);

    const { gameId, y } = body;
    const success = this.gameService.gameMove({
      gameId,
      player: socket.data.user,
      newY: y,
    });

    if (success) {
      callback(null, y);
    } else {
      callback(new Error("top"), null);
    }
  }
  async matchMaking(socket: Socket) {
    const io = Container.get(socketio.Server);
    console.log("matchMaking");
    const game: Game = this.matchMakingService.addSocket(socket);
    console.log("game : " + game);
    if (game != undefined) {
      io.to(game.toRoom()).emit("game_starting", {
        player1: game.player1.id,
        player2: game.player2.id,
        gameId: game.id,
      });
      game.start();
      console.log("starting....");
    }
  }
}
