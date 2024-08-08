import http from 'http'
import dotenv from 'dotenv';
import { Server } from 'http';
import app from './app';
import sequelize from './api/config/db';
import { Server as SocketIoServer } from 'socket.io';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './api/types/global';
import SocketConnection from './api/config/socketConnection';
import setupAssociation from './api/models/associations/associations';

dotenv.config();

const port: string = process.env.PORT || '3000';
const server: Server = http.createServer(app);
export const io = new SocketIoServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
    cors: {
        origin: 'http://localhost:4000', // Update this to match your client origin
        methods: ['GET', 'POST'],
    },
});

(async() => {
    try {
        await sequelize.authenticate();
        setupAssociation();

        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        await sequelize.sync({ alter: process.env.MODE === 'dev' })
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})()

SocketConnection();

console.log(`https:://localhost:${port}`);

server.listen(port);