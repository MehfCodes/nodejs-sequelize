import { DataTypes, Model, Optional } from 'sequelize';
import db from '../configs/dbConnection';
import Post from './post.model';
import User from './user.model';

export interface LikeAttributes {
  id: number;
  postId?: number;
  userId?: number;
  // quantity: number;
}

interface LikeCreationAttributes extends Optional<LikeAttributes, 'id'> {}

class Like
  extends Model<LikeAttributes, LikeCreationAttributes>
  implements LikeAttributes
{
  id!: number;
  postId?: number;
  userId?: number;
  // quantity!: number;
}

Like.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    // quantity: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   defaultValue: 0,
    //   set(value) {
    //     this.setDataValue('quantity', this.getDataValue('quantity') + 1);
    //   },
    // },
  },
  {
    sequelize: db,
    tableName: 'Likes',
  }
);

Like.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false } });
Like.belongsTo(Post, { foreignKey: { name: 'postId', allowNull: false } });

export default Like;
