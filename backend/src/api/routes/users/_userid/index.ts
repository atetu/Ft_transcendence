import * as celebrate from "celebrate";
import * as express from "express";
import Container from "typedi";
import User from "../../../../entities/User";
import UserService from "../../../../services/UserService";
import helpers from "../../../helpers";
import middlewares from "../../../middlewares";
import achievements from "./achievements";
import avatar from "./avatar";

export default (app: express.Router) => {
  const userService = Container.get(UserService);

  const route = express.Router();

  app.use(
    "/:userid",
    celebrate.celebrate({
      [celebrate.Segments.PARAMS]: {
        userid: celebrate.Joi.number().required(),
      },
    }),
    async (req, res, next) => {
      const id = Number(req.params.userid);

      try {
        const user = await userService.findById(id);
        res.locals.user = user;

        if (!user) {
          return helpers.notFound("user not found");
        }

        next();
      } catch (error) {
        next(error);
      }
    },
    route
  );

  route.get("/", middlewares.authorize(false), async (req, res, next) => {
    const user: User = res.locals.user;

    res.status(200).send(user.toJSON());
  });

  achievements(route);
  avatar(route);

  return route;
};
