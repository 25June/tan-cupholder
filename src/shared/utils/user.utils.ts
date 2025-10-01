import { UserRole, USER_ROLE_LABEL } from '@/constants/user';

export const formatUserData = (formData: FormData) => {
  // Extract form values
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;
  const status = formData.get('status') as string;

  // Create full name from first and last name
  const fullName = `${firstName} ${lastName}`;

  // Map role label to enum value
  const mappedRole =
    role === USER_ROLE_LABEL[UserRole.Admin]
      ? UserRole.Admin
      : role === USER_ROLE_LABEL[UserRole.Staff]
      ? UserRole.Staff
      : null;

  // Construct new FormData with mapped values
  const newData = new FormData();
  newData.append('firstName', firstName);
  newData.append('lastName', lastName);
  newData.append('email', email);
  newData.append('status', status);
  newData.append('fullName', fullName);
  if (mappedRole) {
    newData.append('role', mappedRole);
  }
  return newData;
};
