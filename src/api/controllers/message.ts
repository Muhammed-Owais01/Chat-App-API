import { NextFunction, Request, Response } from "express";
import { ReturnResponse } from "../types/global";
import Message from "../models/message";
import MessageServices from "../services/message";
import RequestError from "../exceptions/requestError";
import { ExceptionType } from "../exceptions/exceptions";
import { io } from "../..";

class MessageController {
    async get_message(req: Request, res: Response, next: NextFunction): Promise<ReturnResponse> {
        const id: number = parseInt(req.params.messageId);

        const message: Message = await MessageServices.getMessageById(id);

        return res.status(200).json({ message: message });
    }

    async get_all_messages(req: Request, res: Response, next: NextFunction): Promise<ReturnResponse> {
        const { limit, page }: { limit?: string, page?: string } = req.query;
        const receiverId: number = parseInt(req.params.receiverId);

        const userId: number | undefined = req.userId;
        if (!userId) throw new RequestError(ExceptionType.USER_NOT_FOUND);

        const { count, messages }: { count: number, messages: Message[] } = await MessageServices.getAllMessages(userId, receiverId, limit, page);

        return res.status(200).json({
            count: count,
            messages: messages.map(message => {
                return {
                    id: message.id,
                    content: message.content,
                    userId: message.userId,
                    receiverId: message.receiverId,
                    timestamp: message.timestamp
                }
            })
        })
    }

    async update_message(req: Request, res: Response, next: NextFunction): Promise<ReturnResponse> {
        const { content }: { content: string } = req.body;

        const id: number = parseInt(req.params.messageId);
        const username: string = req.userData?.username;

        const updatedMessage: void = await MessageServices.updatedMessage(id, content, username);

        io.emit('message updated', id);
        return res.status(200).json({ message: "Message updated" });
    }

    async delete_message(req: Request, res: Response, next: NextFunction): Promise<ReturnResponse> {
        const id: number = parseInt(req.params.messageId);
        const username: string = req.userData?.username;

        const deletedMessage = await MessageServices.deleteMessage(id, username);

        io.emit('message deleted', id);
        return res.status(200).json({ message: "Message deleted" });
    }
}

const MessageControllerObj = new MessageController;

export default MessageControllerObj;