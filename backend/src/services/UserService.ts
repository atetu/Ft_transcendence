import * as crypto from "crypto";

import { getRepository, MigrationInterface, QueryRunner } from "typeorm";

import { User } from "../entities";
import Tokens from "../models/Tokens";
import { generateJWT } from "./JWTService";
import { generateRefreshToken } from "./RefreshTokenService";

export async function getUser(id: number): Promise<User> {
  const repository = getRepository(User);

  return repository.findOne(id);
}

export async function generateTokens(user: User): Promise<Tokens> {
  const refreshToken = await generateRefreshToken(user);

  return {
    accessToken: generateJWT(user),
    refreshToken: refreshToken.token,
  };
}

export async function authenticate(user: User): Promise<Tokens> {
  return generateTokens(user);
}
