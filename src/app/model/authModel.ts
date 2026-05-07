import { Role } from './account.model';

export interface AuthResponseModel {
  id: string;
  displayName: string;
  role: string;
}
