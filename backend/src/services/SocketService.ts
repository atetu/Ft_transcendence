import Container, { Service, Inject } from "typedi";
import * as socketio from "socket.io";
import User from "../entities/User";
import ChannelService from "./ChannelService";
import ChannelMessage from "../entities/ChannelMessage";
import Channel from "../entities/Channel";

@Service()
export default class SocketService {
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
    const { id } = socket.data.user;

    if (this.connectedUserIds[id]) {
      this.connectedUserIds[id] += 1;
    } else {
      socket.broadcast.emit("client_connected_join", id);

      this.connectedUserIds[id] = 1;
    }

    socket.emit("client_connected_list", Object.keys(this.connectedUserIds));
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
    const user: User = socket.data.user;
    const { channelId } = body;

    try {
      const channel = await this.channelService.findById(channelId);

      if (!channel) {
        throw new Error("channel not found");
      }

      socket.join(channel.toRoom());
      callnack(null, 1);
    } catch (error) {
      console.log(error);
      callnack(error, null);
    }
  }

  async broadcastMessage(message: ChannelMessage) {
    const io = Container.get(socketio.Server);

    const channel = message.channel;

    io.to(channel.toRoom()).emit("channel_message", message.toJSON());
  }

  async broadcastNewChannel(channel: Channel) {
    const io = Container.get(socketio.Server);

    io.emit("channel_new", channel.toJSON());
  }
}
