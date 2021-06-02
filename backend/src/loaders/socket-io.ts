import * as http from "http";
import * as socketio from "socket.io";
import { Container } from "typedi";
import socketAuthentication from "../middlewares/SocketAuthentication";
import SocketService from "../services/SocketService";

export default async ({ server }: { server: http.Server }) => {
  const io = new socketio.Server(server, {
    cookie: false,
    cors: {    
      origin: "*",    
      methods: ["GET", "POST"]  
    }
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

    socket.on('game_connect', (body, callback) => {
      socketService.gameConnect(socket, body, callback)
    })

    socket.on('game_move', (body, callback) => {
      socketService.gameMove(socket, body, callback)
    })

    socket.on('waiting_room', () => {
      console.log('first step')
      socketService.matchMaking(socket)
    })
  });
};
