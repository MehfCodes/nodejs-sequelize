import { Model, Optional, Sequelize } from 'sequelize';

export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string | undefined;
}

export interface UserI extends UserAttributes {
  token: string;
  password?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
