import { Router } from "express";
import * as passport from "passport";
import * as joi from "@hapi/joi";

import { validateRequest } from "../middlewares/validate-request";

import RefreshToken from "../services/RefreshTokenService";

const router = Router();

function oauth(name: string, scopes: string[]) {
  router.get(
    `/oauth/${name}`,
    passport.authenticate(name, {
      session: false,
      scope: scopes,
    })
  );

  router.get(`/oauth/${name}/callback`, (req, res, next) => {
    passport.authenticate(name, (err, user, info) => {
      if (user) {
        res.status(200).send({
          user,
        });
      } else {
        res.status(400).send({
          message: "failed",
        });
      }
    })(req, res, next);
  });
}

oauth("google", ["profile", "email"]);
oauth("marvin", ["public"]);

router.post(
  "/refresh-token",
  (req, res, next) => {
    validateRequest(
      req,
      next,
      joi.object({
        accessToken: joi.string().required(),
        refreshToken: joi.string().required(),
      })
    );
  },
  async (req, res, next) => {
    try {
      const tokens = await refreshToken(req.body.refreshToken);

      res.status(200).send({
        tokens,
      });
    } catch (error) {
      console.log(error)

      res.status(400).send({
        message: error,
      });
    }
  }
);

export default router;
