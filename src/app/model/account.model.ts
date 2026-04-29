export interface AccountModel {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
  lastOnlineAt?: string;
  createdAt: string;
  updatedAt?: string;
}
