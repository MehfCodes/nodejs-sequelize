import { DataTypes, Model, Optional } from 'sequelize';
import db from '../configs/dbConnection';
import Post from './post.model';
import User from './user.model';

export interface CommnetAttributes {
  id: number;
  userId: number;
  postId: number;
  content: string;
}

export interface CommentCreationAttributes
  extends Optional<CommnetAttributes, 'id'> {}

class Comment
  extends Model<CommnetAttributes, CommentCreationAttributes>
  implements CommnetAttributes
{
  id!: number;
  userId!: number;
  postId!: number;
  content!: string;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: Post,
        key: 'id',
      },
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: 'Comments',
  }
);

export default Comment;
