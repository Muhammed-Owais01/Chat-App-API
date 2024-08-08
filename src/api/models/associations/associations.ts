import Friends from "../friends";
import Message from "../message"
import User from "../user"

const setupAssociation = () => {
    Message.belongsTo(User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        as: 'creator'
    });

    Message.belongsTo(User, {
        foreignKey: 'receiverId',
        onDelete: 'CASCADE',
        as: 'receiver'
    })

    Friends.belongsTo(User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        as: 'creator'
    });

    Friends.belongsTo(User, {
        foreignKey: 'receiverId',
        onDelete: 'CASCADE',
        as: 'receiver'
    })
}

export default setupAssociation;