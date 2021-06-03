import { DataTypes, Model, Optional } from 'sequelize';
import db from '../configs/dbConnection';
import User from './user.model';

export interface PostAttributes {
  id: number;
  authorId?: number;
  title: string;
  //   imageCover:string;
  //   otherImages:string;
  content: string;
  //   likes:number;
  // comments:
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  public id!: number;
  public authorId?: number;
  public title!: string;
  public imageCover!: string;
  public otherImages!: string;
  public content!: string;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: 'Posts',
  }
);

Post.belongsTo<Post, User>(User, {
  foreignKey: {
    name: 'authorId',
    allowNull: false,
  },
});

export default Post;
