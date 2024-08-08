import { Dialect, Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
    process.env.SEQUELIZE_DATABASE as string, 
    process.env.SEQUELIZE_USERNAME as string, 
    process.env.SEQUELIZE_PASSWORD as string, 
    {
        host: process.env.SEQUELIZE_HOST as string,
        dialect: process.env.SEQUELIZE_DIALECT as Dialect,
        logging: false
    }
);

export default sequelize;