import MessageDAO from "../daos/message";
import { ExceptionType } from "../exceptions/exceptions";
import RequestError from "../exceptions/requestError";
import Message from "../models/message";
import parseQuery from "../utils/parseQuery";

class MessageServices {
    async getMessageById(messageId: number): Promise<Message> {
        const message: Message | null = await MessageDAO.getById(messageId);
        if (!message) throw new RequestError(ExceptionType.MESSAGE_NOT_FOUND);
        return message;
    }

    async getAllMessages(userId: number, receiverId: number, oldLimit?: string, page?: string): Promise<{ count: number, messages: Message[]}> {
        const { offset, limit }: { offset?: number, limit?: number } = parseQuery(oldLimit, page);

        const messages: Message[] = await MessageDAO.getAll(userId, receiverId, limit, offset);
        if (!messages) throw new RequestError(ExceptionType.MESSAGE_NOT_FOUND);

        return {
            count: await MessageDAO.countAll(messages),
            messages: messages
        }
    }

    async updatedMessage(messageID: number, content: string, username: string): Promise<void> {
        const message: Message = await this.getMessageById(messageID);

        if (message.creator?.username !== username) throw new RequestError(ExceptionType.UNAUTHORIZED);

        await MessageDAO.update(messageID, content);
    }

    async deleteMessage(messageID: number, username: string) {
        const message: Message = await this.getMessageById(messageID);

        if (message.creator?.username !== username) throw new RequestError(ExceptionType.UNAUTHORIZED);

        await MessageDAO.delete(messageID);
    }
}

const MessageServicesObj = new MessageServices;

export default MessageServicesObj;