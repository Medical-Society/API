import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // use parseAsync
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
      });
      next();
    } catch (e: any) {
      res.status(400).send(e.errors);
    }
  };

export default validateResource;
