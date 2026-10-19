import { UserRole } from './enums';

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type RegisterResponse = {
  message: string;
};

export type UserModel = {
  id: number;
  name: string;
  email: string;
  roles: UserRole[];
  age: number | null;
  weight: number | null;
  height: number | null;
  trainingPlansIds?: number[];
  userIdentifier: string;
};
