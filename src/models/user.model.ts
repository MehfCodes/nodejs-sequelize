import bcrypt from 'bcryptjs';
import { DataTypes, Model, Optional } from 'sequelize';
import db from '../configs/dbConnection';

const { hash, genSalt } = bcrypt;

export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string | undefined;
}

export interface UserI extends UserAttributes {
  token: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public email!: string;
  public password: string | undefined;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isRequire(value: string) {
          if (value === '') {
            throw new Error('username is required.');
          }
        },
        notNull: { msg: 'username is required.' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'please enter correct email format.',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 10],
          msg: 'password length must be between 8 and 10 characters.',
        },
        notNull: {
          msg: "password can't be null.",
        },
      },
    },
  },
  {
    sequelize: db,
    tableName: 'Users',
  }
);

User.beforeSave(async (user) => {
  if (user.changed('password')) {
    const salt = await genSalt(10);
    const hashedPassword = await hash(user.password!, salt);
    user.password = hashedPassword;
  }
});
export default User;
