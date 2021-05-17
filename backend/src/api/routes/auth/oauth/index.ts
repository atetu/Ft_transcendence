import * as celebrate from "celebrate";
import * as express from "express";
import * as passport from "passport";
import { Container } from "typedi";
import OAuthService from "../../../../services/OAuthService";

function oauth(route: express.Router, name: string, scopes: string[]) {
  route.get(
    `/${name}`,
    passport.authenticate(name, {
      session: false,
      scope: scopes,
    })
  );

  route.get(
    `/${name}/callback`,
    celebrate.celebrate({
      [celebrate.Segments.QUERY]: {
        code: celebrate.Joi.string().required(),
      },
    }),
    (req, res, next) => {
      passport.authenticate(name, (err, user, info) => {
        console.log(err);

        if (err) {
          next(err);
        } else {
          res.status(200).send(user);
        }
      })(req, res, next);
    }
  );
}

export default (app: express.Router) => {
  const oauthService = Container.get(OAuthService);

  const route = express.Router();

  app.use("/oauth", route);

  oauth(route, "google", ["profile", "email"]);
  oauth(route, "marvin", ["public"]);

  oauthService.install();

  return route;
};
