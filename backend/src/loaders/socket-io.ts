import * as http from "http";
import * as socketio from "socket.io";
import { Container } from "typedi";
import * as socketController from "socket-controllers";
import SocketService from "../services/SocketService";
import socketAuthentication from "../middlewares/SocketAuthentication";

export default async ({ server }: { server: http.Server }) => {
  const io = new socketio.Server(server, {
    cookie: false,
  });

  Container.set(socketio.Server, io);
  const socketService = Container.get(SocketService);

  io.use(socketAuthentication());

  /*socketController.useSocketServer(io, {
    controllers: [SocketService],
    middlewares: [AuthenticationMiddleware],
  });*/

  io.on("connection", (socket) => {
    socketService.connect(socket);

    socket.on('disconnect', () => {
      socketService.disconnect(socket);
    })

    socket.on('channel_connect', (body, callback) => {
      socketService.channelConnect(socket, body, callback)
    })
  });
};
