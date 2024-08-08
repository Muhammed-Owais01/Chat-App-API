import UserDAO from "../daos/user";
import RequestError from "../exceptions/requestError";
import User from "../models/user";
import bcrypt from 'bcrypt'
import { ExceptionType } from "../exceptions/exceptions";
import jwt from 'jsonwebtoken';
import FriendsDAO from "../daos/friends";
import Friends from "../models/friends";

class UserServices {
    async getUserById(userId: number): Promise<User> {
        const user: User | null = await UserDAO.getById(userId);
        if (!user) throw new RequestError(ExceptionType.USER_NOT_FOUND);
        return user;
    }

    async getUserByName(username: string): Promise<User> {
        const user: User | null = await UserDAO.getByName(username);
        if (!user) throw new RequestError(ExceptionType.USER_NOT_FOUND);
        return user;
    }

    async getAllFriends(userId: number) {
        const user: User = await this.getUserById(userId);

        const friends: Friends[] | null = await FriendsDAO.getAllFriends(userId);
        if (!friends) throw new RequestError(ExceptionType.USER_NOT_FOUND);

        const friendIds = friends.reduce((acc: number[], friend: Friends) => {
            if (friend.userId !== userId) acc.push(friend.userId);
            if (friend.receiverId !== userId) acc.push(friend.receiverId);
            return acc;
        }, [] as number[]);

        const users: User[] = await UserDAO.getAllFriends(friendIds);
        return users;
    }

    async signupUser(username: string, password: string): Promise<User> {
        const existingUser: User | null = await UserDAO.getByName(username)
        if (existingUser) throw new RequestError(ExceptionType.USERNAME_CONFLICT);

        const hash: string = await bcrypt.hash(password, 10);
        const user: User | null = await UserDAO.create(username, hash);
        if (!user) throw new RequestError(ExceptionType.INTERNAL_ERROR);

        return user;
    }

    async addFriend(userId: number, receiverId: number): Promise<Friends> {
        const user: User = await this.getUserById(userId);

        const friend: Friends | null = await FriendsDAO.addFriend(userId, receiverId);
        if (!friend) throw new RequestError(ExceptionType.INTERNAL_ERROR);

        return friend;
    }

    async loginUser(username: string, password: string): Promise<{ token: string, userId: number}> {
        const user: User | null = await UserDAO.getByName(username);

        if (!user) throw new RequestError(ExceptionType.USER_NOT_FOUND);
        
        const result: boolean = await bcrypt.compare(password, user.password);
        if (!result) throw new RequestError(ExceptionType.AUTH_FAILURE);

        const token: string = jwt.sign({
            username: user.username,
            userId: user.id
        }, process.env.JWT_KEY as string, { expiresIn: "4h" });

        return {
            token,
            userId: user.id
        }
    }

    async updateUser(userId: number, username?: string, password?: string): Promise<void> {
        if (username) {
            const user: User = await this.getUserByName(username);
        }

        if (password) {
            const hash: string = await bcrypt.hash(password, 10);
            password = hash;
        }

        await UserDAO.update(userId, username, password);
    }

    async deleteUser(userId: number): Promise<void> {
        const user: User = await this.getUserById(userId);

        await UserDAO.delete(userId);
    }
}

const UserServicesObj = new UserServices;

export default UserServicesObj;