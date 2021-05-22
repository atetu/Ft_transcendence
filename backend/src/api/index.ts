import { Router } from "express";

import auth from "./routes/auth";
import users from "./routes/users";
import channels from "./routes/channels";
import achievements from "./routes/achievements";

export default () => {
  const app = Router();

  auth(app);
  users(app);
  channels(app);
  achievements(app);

  return app;
};
