import { Router } from "express";

import auth from "./routes/auth";
import users from "./routes/users";
import channels from "./routes/channels";

export default () => {
  const app = Router();

  auth(app);
  users(app);
  channels(app);

  return app;
};
