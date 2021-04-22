import bcrypt from 'bcryptjs';
import sequelize from 'sequelize';
import db from '../configs/dbConnection.js';
const { Model, DataTypes } = sequelize;
const { hash, genSalt } = bcrypt;
export default class User extends Model {}

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
        isRequire(value) {
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

await User.sync();
User.beforeSave(async (user, options) => {
  if (user.changed('password')) {
    const salt = await genSalt(10);
    const hashedPassword = await hash(user.password, salt);
    user.password = hashedPassword;
  }
});
