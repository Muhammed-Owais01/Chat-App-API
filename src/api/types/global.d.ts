import Message from "../models/message";
import { JwtPayload } from "jsonwebtoken";
import { Express } from "express";
import { Multer } from "multer";
import ParsedQs from 'qs'


export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  'chat_message': (message: Message) => void;
  'message deleted': (id: number) => void;
  'message updated': (id: number) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  'chat message': (msg: { content: string, userId: number, receiverId: number }) => void;
  'authenticate': (userId: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

export type ReturnResponse = Response<any, Record<string, any>>; 

declare global {
    namespace Express {
        interface Request {
            userData?: JwtPayload;
            userId?: number;
            file?: Express.Multer.File;
            query: {
              limit?: string;
              page?: string
            } & ParsedQs;
        }
    }
}
