import { NextFunction, Request, Response, Router } from "express";
import authorize from "../middlewares/authorize";

const router = Router();

router.get("/", authorize(true), (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({
    message: "finally",
  });
});

export default router;
