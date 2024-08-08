import { Op } from "sequelize";
import Friends from "../models/friends";

class FriendsDAO {
    async getAllFriends(userId: number): Promise<Friends[] | null> {
        const friends: Friends[] | null = await Friends.findAll({ 
            where: { 
                [Op.or]: [
                    { userId: userId },
                    { receiverId: userId }
                ]
            },
        })
        return friends;
    }

    async addFriend(userId: number, friendId: number): Promise<Friends | null> {
        const friend: Friends | null = await Friends.create({
            userId: userId,
            receiverId: friendId
        })
        return friend;
    }
}

const FriendsDAOObj = new FriendsDAO;

export default FriendsDAOObj;