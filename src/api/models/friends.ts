import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import User from "./user";
import sequelize from "../config/db";

class Friends extends Model<InferAttributes<Friends>, InferCreationAttributes<Friends>> {
    declare id: CreationOptional<number>;
    declare userId: ForeignKey<User['id']>;
    declare receiverId: ForeignKey<User['id']>;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

Friends.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        receiverId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        }
    },
    {
        sequelize,
        tableName: 'friends'
    }
)

export default Friends;