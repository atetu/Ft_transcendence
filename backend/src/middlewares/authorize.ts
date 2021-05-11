import * as jwt from "express-jwt";
import { NextFunction, Request, Response } from "express";

import { env } from "../app";

import { getUser } from "../services/UserService";

export default function authorize(onlyAdmin = false): any[] {
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
