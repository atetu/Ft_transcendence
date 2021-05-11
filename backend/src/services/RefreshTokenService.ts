import * as crypto from "crypto";

import { getRepository, MigrationInterface, QueryRunner } from "typeorm";

import { User, RefreshToken } from "../entities";
import Tokens from "../models/Tokens";
import { generateJWT } from "./JWTService";

function randomTokenString() {
  return crypto.randomBytes(40).toString("hex");
}

export async function getRefreshToken(token: string): Promise<RefreshToken> {
  const repository = getRepository(RefreshToken);

  const refreshToken = await repository.findOne({
    where: { token },
  });

  if (!refreshToken || !refreshToken.active) {
    throw "invalid token";
  }

  return refreshToken;
}

export async function generateRefreshToken(user: User): Promise<RefreshToken> {
  const repository = getRepository(RefreshToken);

  const refreshToken = new RefreshToken();
  refreshToken.user = user;
  refreshToken.token = randomTokenString();
  refreshToken.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return await repository.save(refreshToken);
}

export async function revokeRefreshToken(
  token: string | RefreshToken
): Promise<RefreshToken> {
  const repository = getRepository(RefreshToken);

  let refreshToken: RefreshToken;
  if (token instanceof RefreshToken) {
    refreshToken = token;
  } else {
    refreshToken = await getRefreshToken(token);
  }

  refreshToken.revoked = new Date(Date.now());

  return await repository.save(refreshToken);
}

export async function refreshToken(token: string): Promise<Tokens> {
  const repository = getRepository(RefreshToken);

  const refreshToken = await getRefreshToken(token);
  const { user } = refreshToken;

  refreshToken.revoked = new Date(Date.now());
  repository.save(refreshToken);

  const newRefreshToken = await generateRefreshToken(user);

  return {
    accessToken: generateJWT(user),
    refreshToken: newRefreshToken.token,
  };
}
