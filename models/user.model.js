import sequelize from 'sequelize';
import db from '../configs/dbConnection.js';

const { Model, DataTypes } = sequelize;
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
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize: db, tableName: 'Users' }
);

await User.sync();
