import { NextFunction, Request, Response } from "express";
import { ReturnResponse } from "../types/global";
import User from "../models/user";
import UserServices from "../services/user";
import RequestError from "../exceptions/requestError";
import { ExceptionType } from "../exceptions/exceptions";
import Friends from "../models/friends";

class UserController {
    async get_user(req: Request, res: Response, next: NextFunction): Promise<ReturnResponse> {
        const userId: number = parseInt(req.params.userId);
        const user: User = await UserServices.getUserById(userId);

        return res.status(200).json({ 
            userId: user.id,
            username: user.username
         });
    }

    async get_all_friends(req: Request, res: Response, next: NextFunction): Promise<ReturnResponse> {
        const id: number | undefined = req.userId;
        if (!id) throw new RequestError(ExceptionType.USER_NOT_FOUND);

        const users: User[] = await UserServices.getAllFriends(id);

        return res.status(200).json({
            users: users.map(user => {
                return {
                    id: user.id,
                    username: user.username,
                }
            })
        })
    }    

    async user_signup(req: Request, res: Response, next: NextFunction): Promise<ReturnResponse> {
        const { username, password }: { username: string | undefined, password: string | undefined } = req.body;
        if (!username || !password) throw new RequestError(ExceptionType.INVALID_REQUEST);

        const user: User = await UserServices.signupUser(username, password);

        return res.status(200).json({ message: "User created"});
    }

    async add_friend(req: Request, res: Response, next: NextFunction): Promise<ReturnResponse> {
        const userId: number | undefined = req.userId;
        if (!userId) throw new RequestError(ExceptionType.USER_NOT_FOUND);

        const receiverId: number = parseInt(req.params.receiverId);
        const friend: Friends = await UserServices.addFriend(userId, receiverId);

        return res.status(200).json({ message: "Successfully added a friend" });
    }

    async user_login(req: Request, res: Response, next: NextFunction): Promise<ReturnResponse> {
        const { username, password }: { username: string | undefined, password: string | undefined } = req.body;
        if (!username || !password) throw new RequestError(ExceptionType.INVALID_REQUEST);

        const { token, userId }: { token: string, userId: number } = await UserServices.loginUser(username, password);

        return res.status(200).json({
            message: "User logged in",
            userId: userId,
            token: `Bearer ${token}`
        })
    }

    async update_user(req: Request, res: Response, next: NextFunction): Promise<ReturnResponse> {
        const id: number = parseInt(req.params.userId);
        const { username, password }: { username?: string, password?: string } = req.body;

        const updatedUser: void = await UserServices.updateUser(id, username, password);

        return res.status(200).json({ message: "User updated" });
    }

    async delete_user(req: Request, res: Response, next: NextFunction): Promise<ReturnResponse> {
        const id: number = parseInt(req.params.userId);

        const deletedUser: void = await UserServices.deleteUser(id);

        return res.status(200).json({ message: "User deleted" });
    }
}

const UserControllerObj = new UserController;

export default UserControllerObj;