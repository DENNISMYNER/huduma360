import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

interface Schemas {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

/** Validates req.body/query/params against Zod schemas and replaces them with the parsed (typed, defaulted) result. */
export const validate = (schemas: Schemas) => (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (schemas.body) req.body = schemas.body.parse(req.body);
    if (schemas.query) req.query = schemas.query.parse(req.query) as typeof req.query;
    if (schemas.params) req.params = schemas.params.parse(req.params) as typeof req.params;
    next();
  } catch (err) {
    next(err);
  }
};
