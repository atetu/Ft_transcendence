import * as http from "http";
import * as socketio from "socket.io";
import { Container } from "typedi";

export default async ({ server }: { server: http.Server }) => {
  const io = new socketio.Server(server, {
    cookie: false,
  });

  Container.set(socketio.Server, io);

  io.on("connection", (socket) => {
    console.log("connected: " + socket.client.conn.id);
  });
};
