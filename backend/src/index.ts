import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { User } from "./entities/User";
import * as cors from "cors";
import * as morgan from "morgan";
import * as passport from "passport";
import routes from "./routes";
import * as oauth from "./security/oauth";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import * as jwt from "jsonwebtoken";
import { env } from "./app";
import { getUser } from "./services/UserService";
import e = require("express");
import { authorizeSocket } from "./middlewares/authorize";

const PORT = 3001;

createConnection()
  .then(async (connection) => {
    oauth.install();

    const app = express();

    app.use(morgan("tiny"));
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(passport.initialize());
    app.use(routes);

    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      // ...
    });

    io.on("connection", (socket) => {
      console.log("connected: " + socket.client.conn.id);
    });

    io.use(authorizeSocket());

    let zzz = 0;
    setInterval(() => {
      io.emit("counter", ++zzz);
    }, 1000);

    app.use(function (err, req, res, next) {
      if (err.name === "UnauthorizedError") {
        if (err.inner && err.inner.name === "TokenExpiredError") {
          return res.status(401).send({
            message: "invalid access token",
          });
        } else {
          return res.status(403).send({
            message: "invalid access token",
          });
        }
      } else if (err.name === "ValidationError") {
        return res.status(403).send({
          message: "validation error",
          info: err.messages,
        });
      } else {
        next(err);
      }
    });

    const server = httpServer.listen(PORT, () => {
      console.log(`Started on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
