import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import RequestError from "../exceptions/requestError";
import { ExceptionType } from "../exceptions/exceptions";

const checkAuth = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader: string | undefined = req.headers.authorization;
        
        if (!authorizationHeader) throw new RequestError(ExceptionType.AUTH_FAILURE);

        const token: string = authorizationHeader.split(" ")[1];
        const decoded: JwtPayload = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload;
        req.userData = decoded;

        if (decoded.userId) 
            req.userId = decoded.userId;
        next();
    } catch (error) {
        throw new RequestError(ExceptionType.AUTH_FAILURE);
    }
})

export default checkAuth;