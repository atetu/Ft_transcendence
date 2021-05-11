import { Router } from "express";

import * as passport from "passport";

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

export default router;
