import { Op } from "sequelize";
import Friends from "../models/friends";

class FriendsDAO {
    async getFriendship(userId: number, receiverId: number): Promise<Friends | null> {
        const friend: Friends | null = await Friends.findOne({
            where: {
                [Op.or]: [
                    {
                        [Op.and]: [
                            { userId: userId },
                            { receiverId: receiverId }
                        ]
                    },
                    {
                        [Op.and]: [
                            { userId: receiverId },
                            { receiverId: userId }
                        ]
                    }
                ]
            }
        })
        return friend;
    }

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