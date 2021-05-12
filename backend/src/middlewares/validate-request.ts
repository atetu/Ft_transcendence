import { NextFunction, Request, Response } from "express";
import { Schema } from "@hapi/joi";

class ValidationError extends Error {
  public messages: string[];

  constructor(messages: string[]) {
    super();

    this.name = "ValidationError";
    this.messages = messages;
  }
}

export function validateRequest(
  req: Request,
  next: NextFunction,
  schema: Schema
) {
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  const { error, value } = schema.validate(req.body, options);

  if (error) {
    next(new ValidationError(error.details.map((x) => x.message)));
  } else {
    req.body = value;
    next();
  }
}
