export enum UserRole {
  Admin = '1',
  // SuperAdmin = 'SUPER_ADMIN',
  Staff = '2'
}

export const USER_ROLE_LABEL = {
  [UserRole.Admin]: 'Admin',
  [UserRole.Staff]: 'Staff'
};

export enum UserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}
