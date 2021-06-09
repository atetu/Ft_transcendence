import * as express from "express";
import { Container } from "typeorm-typedi-extensions";
import User from "../../../../../../entities/User";
import OTPService from "../../../../../../services/OTPService";

export default (app: express.Router) => {
  const otpService = Container.get(OTPService);

  const route = express.Router();

  app.use("/otp", route);

  const sendStatus = (user: User, res: express.Response) => {
    const secret = user.otpSecret;

    res.status(200).send({
      enabled: user.otp,
      uri: otpService.generateURI(user),
    });
  };

  route.get("/", (req, res, next) => {
    const user: User = req.user as any;

    sendStatus(user, res);
  });

  route.post("/", async (req, res, next) => {
    const user: User = req.user as any;

    await otpService.enable(user);

    sendStatus(user, res);
  });

  route.delete("/", async (req, res, next) => {
    const user: User = req.user as any;

    await otpService.disable(user);

    sendStatus(user, res);
  });

  return route;
};
