import * as celebrate from "celebrate";
import * as express from "express";
import Container from "typedi";
import User from "../../../../entities/User";
import AvatarService from "../../../../services/AvatarService";
import UserService from "../../../../services/UserService";
import achievements from "./achievements";

export default (app: express.Router) => {
  const avatarService = Container.get(AvatarService);

  const route = express.Router();

  app.use("/avatar", route);

  route.get("/", async (req, res, next) => {
    const user: User = res.locals.user;

    res.sendFile(avatarService.getDestination(user.picture), {
      root: ".",
      headers: {
        "Content-Type": "image/png",
      },
    });
  });

  return route;
};
