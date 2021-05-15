import Container, { Service, Inject } from "typedi";
import * as socketio from "socket.io";
import {
  SocketController,
  OnConnect,
  OnDisconnect,
  ConnectedSocket,
  EmitOnSuccess,
} from "socket-controllers";

@Service()
@SocketController()
export default class SocketService {
  connectedUserIds = {};

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
      socket.broadcast.emit('client_connected_join', id);

      this.connectedUserIds[id] = 1;
    }

    console.log("client connected: " + socket.data.user.id);
    console.log(this.connectedUserIds);

    return Object.keys(this.connectedUserIds)
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: any) {
    const { id } = socket.data.user;

    if (this.connectedUserIds[id]) {
      const now = (this.connectedUserIds[id] -= 1);

      if (now === 0) {
        socket.broadcast.emit('client_connected_quit', id);

        delete this.connectedUserIds[id];
      }
    }

    console.log("client disconnected: " + socket.data.user.id);
    console.log(this.connectedUserIds);
  }
}
