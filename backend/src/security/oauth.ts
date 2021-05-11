import * as passport from "passport";
import { getRepository, MigrationInterface, QueryRunner } from "typeorm";

import { User } from "../entities/User";

import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as MarvinStrategy } from "../auth/marvin";

import { env } from "../app";
import { assert } from "console";
import { authenticate } from "../services/UserService";

export function install() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_ID,
        clientSecret: env.GOOGLE_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, callback) {
        try {
          const userRepository = getRepository(User);

          const email = profile.email;
          assert(email, "email value is null");

          let user = await userRepository.findOne({
            where: {
              email,
            },
          });

          if (user) {
            return callback(null, await authenticate(user));
          }

          user = new User();
          user.username = email.split("@")[0];
          user.email = email;
          user.admin = false;

          await userRepository.save(user);

          callback(null, await authenticate(user));
        } catch (error) {
          callback(error, null);
        }
      }
    )
  );

  passport.use(
    "marvin",
    MarvinStrategy(
      {
        clientID: env.MARVIN_ID,
        clientSecret: env.MARVIN_SECRET,
        callbackURL: "http://localhost:3000/auth/marvin/callback",
      },
      function (accessToken, refreshToken, profile, callback) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);

        callback(null, {
          email: profile.email,
        });
      }
    )
  );
}
