import { Request, Response, NextFunction } from "express";
import RequestError from "../exceptions/requestError";

const errorHandler = (error: Error | RequestError, req: Request, res: Response, next: NextFunction) => {
    let error_status: number;
    let error_message: string;

    if (error instanceof RequestError) {
        error_status = error.status || 500;
        error_message = error.message;
    } else {
        error_status = 500;
        error_message = "Internal Server Error"
    }

    console.log(error);

    res.status(error_status).json({
        error: {
            message: error_message
        }
    })
}

export default errorHandler;