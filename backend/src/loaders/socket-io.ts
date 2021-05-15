import * as http from "http";
import * as socketio from "socket.io";
import { Container } from "typedi";
import * as socketController from "socket-controllers";
import SocketService from "../services/SocketService";
import { AuthenticationMiddleware } from "../middlewares/SocketAuthentication";

export default async ({ server }: { server: http.Server }) => {
  const io = new socketio.Server(server, {
    cookie: false,
  });

  Container.set(socketio.Server, io);
  
  socketController.useSocketServer(io, {
    controllers: [SocketService],
    middlewares: [AuthenticationMiddleware],
  });

  io.on("connection", (socket) => {
    console.log("connected: " + socket.client.conn.id);
  });
};
