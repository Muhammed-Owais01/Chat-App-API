import { Express } from 'express';
import UserRouter from '../routes/user';
import MessageRouter from '../routes/message';

const routes = (app: Express) => {
    app.use('/user', UserRouter)
    .use('/message', MessageRouter);
}

export default routes;