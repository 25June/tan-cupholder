import { UserStatus, UserRole } from '@/constants/user';

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  avatarURL?: string;
  createdAt?: string;
  updatedAt?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified?: boolean;
  emailVerifiedAt?: string;
}

export interface UserCredentials {
  id: string;
  userId: string;
  email: string;
  password: string;
  provider: string;
  createdAt?: string;
  updatedAt?: string;
}
