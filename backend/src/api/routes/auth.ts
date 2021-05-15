import * as passport from "passport";
import * as celebrate from "celebrate";
import * as express from "express";
import { Container } from "typedi";
import OAuthService from "../../services/OAuthService";
import AuthService from "../../services/AuthService";

function oauth(route: express.Router, name: string, scopes: string[]) {
  route.get(
    `/oauth/${name}`,
    passport.authenticate(name, {
      session: false,
      scope: scopes,
    })
  );

  route.get(
    `/oauth/${name}/callback`,
    celebrate.celebrate({
      [celebrate.Segments.QUERY]: {
        code: celebrate.Joi.string().required(),
      },
    }),
    (req, res, next) => {
      passport.authenticate(name, (err, user, info) => {
        console.log(err);

        if (err) {
          next(err)
        } else {
          res.status(200).send(user);
        }
      })(req, res, next);
    }
  );
}

export default (app: express.Router) => {
  const authService = Container.get(AuthService);
  const oauthService = Container.get(OAuthService);

  const route = express.Router();

  app.use("/auth", route);

  oauth(route, "google", ["profile", "email"]);
  oauth(route, "marvin", ["public"]);

  oauthService.install();

  route.post(
    "/refresh-token",
    celebrate.celebrate({
      [celebrate.Segments.BODY]: {
        accessToken: celebrate.Joi.string().required(),
        refreshToken: celebrate.Joi.string().required(),
      },
    }),
    async (req, res, next) => {
      try {

        const tokens = await authService.refresh(req.body.refreshToken);

        res.status(200).send(tokens);
      } catch (error) {
        next(error);
      }
    }
  );

  return route;
};
