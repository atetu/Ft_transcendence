import { Router } from "express";

import auth from "./auth";
import channels from "./channels";

const routes = Router();

routes.use("/auth", auth);
routes.use("/channels", channels);

export default routes;
