export interface AccountModel {
  id: string;
  username: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  password: string;
}

export interface AddAccountModel {
  username: string;
  email: string;
  role: Role;
  isActive: boolean;
  password: string;
}

export interface UpdateAccountModel extends AddAccountModel {
  id: string;
}

export enum Role {
  admin = 99,
  user = 0,
}
