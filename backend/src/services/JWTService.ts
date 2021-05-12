import * as jsonwebtoken from "jsonwebtoken";

import { env } from "../app";

import { User } from "../entities/User";

export function generateJWT(user: User): string {
  return jsonwebtoken.sign(
    {
      sub: user.id,
      id: user.id,
    },
    env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
}
