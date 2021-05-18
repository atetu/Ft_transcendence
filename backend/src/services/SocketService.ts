import Container, { Service, Inject } from "typedi";
import * as socketio from "socket.io";
import {
  SocketController,
  OnConnect,
  OnDisconnect,
  ConnectedSocket,
  EmitOnSuccess,
  OnMessage,
  MessageBody,
} from "socket-controllers";
import User from "../entities/User";
import ChannelService from "./ChannelService";
import Channel from "../entities/Channel";
import ChannelMessage from "../entities/ChannelMessage";

@Service()
@SocketController()
export default class SocketService {
  connectedUserIds = {};

  private channelService: ChannelService = Container.get(ChannelService);

  // constructor() {
  //   const io = Container.get(socketio.Server)

  //   setInterval(() => {
  //     io.emit('client_connected_list', Object.keys(this.connectedUserIds))
  //   }, 8000)
  // }

  @OnConnect()
  @EmitOnSuccess("client_connected_list")
  connect(@ConnectedSocket() socket: any) {
    const { id } = socket.data.user;

    if (this.connectedUserIds[id]) {
      this.connectedUserIds[id] += 1;
    } else {
      socket.broadcast.emit("client_connected_join", id);

      this.connectedUserIds[id] = 1;
    }

    return Object.keys(this.connectedUserIds);
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: any) {
    const { id } = socket.data.user;

    if (this.connectedUserIds[id]) {
      const now = (this.connectedUserIds[id] -= 1);

      if (now === 0) {
        socket.broadcast.emit("client_connected_quit", id);

        delete this.connectedUserIds[id];
      }
    }
  }

  @OnMessage("channel_connect")
  async channelConnect(
    @ConnectedSocket() socket: any,
    @MessageBody() body: any
  ) {
    const user: User = socket.data.user;
    const { channelId } = body;

    try {
      const channel = await this.channelService.findById(channelId);

      if (!channel) {
        throw new Error("channel not found");
      }

      socket.join(channel.toRoom());
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async broadcastMessage(message: ChannelMessage) {
    const io = Container.get(socketio.Server);

    const channel = message.channel;

    io.to(channel.toRoom()).emit("channel_message", message.toJSON());
  }
}
