import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

const validateResource =
  (schema: AnyZodObject) => (req: Request, _: Response, next: NextFunction) => {
    try {
      // use parseAsync
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
      });
      next();
    } catch (err: any) {
      next(err);
    }
  };

export default validateResource;
