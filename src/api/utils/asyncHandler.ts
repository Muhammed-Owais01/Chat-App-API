import { NextFunction, Request, RequestHandler, Response } from "express";

const asyncHandler = (callback: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(callback(req, res, next)).catch(err => {
        console.log(err);
        next(err);
    });
}

export default asyncHandler;