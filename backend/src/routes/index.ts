import { Router } from "express";

import auth from "./auth";
import channels from "./channels";
import users from "./users";

const routes = Router();

routes.use("/auth", auth);
routes.use("/users", users);
routes.use("/channels", channels);

export default routes;
