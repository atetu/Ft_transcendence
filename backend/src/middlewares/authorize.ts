import * as jwt from "express-jwt";
import { NextFunction, Request, Response } from "express";

import { env } from "../app";

import { getUser } from "../services/UserService";
import * as jsonwebtoken from "jsonwebtoken";

export function authorizeRoute(onlyAdmin = false): any[] {
  return [
    jwt({
      secret: env.JWT_SECRET,
      algorithms: ["HS256"],
    }),

    async (req: Request, res: Response, next: NextFunction) => {
      const user = await getUser(req.user.id);

      if (!user || (onlyAdmin && !user.admin)) {
        return res.status(401).json({
          message: "unauthorized",
          authenticated: !!user,
        });
      }

      req.user = user;

      next();
    },
  ];
}

export function authorizeSocket() {
  return async (socket, next) => {
    const { accessToken } = socket.handshake.auth;

    try {
      const payload: any = jsonwebtoken.verify(accessToken, env.JWT_SECRET);

      const user = await getUser(payload.id);

      if (!user) {
        next(new Error("invalid user id"));
      } else {
        socket.data.user = user;
        next();
      }
    } catch (error) {
      console.log(error);
      next(new Error("invalid access token"));
    }
  };
}
