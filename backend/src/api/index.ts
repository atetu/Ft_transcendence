import { Router } from "express";

import auth from "./routes/auth";
import users from "./routes/users";
import channels from "./routes/channels";
import achievements from "./routes/achievements";
import search from "./routes/search";
import directMessages from "./routes/direct-messages";

export default () => {
  const app = Router();

  auth(app);
  users(app);
  channels(app);
  achievements(app);
  directMessages(app);
  search(app)

  return app;
};
