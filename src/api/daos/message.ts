import { Op } from "sequelize";
import Message from "../models/message";
import User from "../models/user";

class MessageDAO {
    async getById(messageId: number): Promise<Message | null> {
        const message: Message | null = await Message.findByPk(messageId, {
            attributes: {
                exclude: ['userId', 'receiverId']
            },
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username']
                },
                {
                    model: User,
                    as: 'receiver',
                    attributes: ['id', 'username']
                }
            ]
        });
        return message;
    }

    async getAll(userId: number, receiverId: number, limit: number | undefined, offset: number | undefined): Promise<Message[]> {
        const messages: Message[] = await Message.findAll({ offset: offset, limit: limit, 
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
            },
            order: [['timestamp', 'ASC']]
         });
        return messages;
    }

    async countAll(messages: Message[]): Promise<number> {
        const count: number = await messages.length;
        return count;
    }

    async create(content: string, userId: number, receiverId: number, timestamp: Date): Promise<Message | null> {
        const message: Message | null = await Message.create({
            content: content,
            userId: userId,
            receiverId: receiverId,
            timestamp: timestamp
        });
        return message;
    }

    async update(id: number, content: string): Promise<number> {
        const [affectedCount]: [number] = await Message.update({content}, {
            where: { id: id }
        })
        return affectedCount;
    }

    async delete(id: number): Promise<number> {
        const count: number = await Message.destroy({ where: { id: id }});
        return count;
    }
}

const MessageDAOObj = new MessageDAO;

export default MessageDAOObj;