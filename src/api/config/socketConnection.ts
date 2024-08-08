import { io } from "../.."
import MessageDAO from "../daos/message";
import { ExceptionType } from "../exceptions/exceptions";
import RequestError from "../exceptions/requestError";
import Message from "../models/message";

const SocketConnection = () => {
    // In-memory store for user ID to socket ID mapping
    const userSocketMap: Record<string, string> = {};

    io.on('connection', socket => {
        console.log(`User connected`);

        socket.on('disconnect', () => {
            for (const userId in userSocketMap) {
                if (userSocketMap[userId] === socket.id) {
                    delete userSocketMap[userId];
                    break;
                } 
            }
            console.log('User disconnected' + socket.id);
        });

        socket.on('authenticate', (userId) => {
            userSocketMap[userId] = socket.id;
        })

        socket.on('chat message', async (msg) => {
            try {
                const message: Message | null = await MessageDAO.create(
                    msg.content,
                    msg.userId,
                    msg.receiverId,
                    new Date(),
                )

                if (!message) throw new RequestError(ExceptionType.INTERNAL_ERROR);

                const receiverSocketId = userSocketMap[msg.receiverId];
                
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('chat_message', message);
                }
                socket.emit('chat_message', message);
            } catch (error: unknown) {
                if (error instanceof RequestError) {
                    console.log(error.message + error.status);
                } else console.log(error);
            }
        })
    })
}

export default SocketConnection;