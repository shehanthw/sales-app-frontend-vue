export type User = {
  name: string;
  role: string;
  nic: string;
  is_active?: boolean;
  is_superuser?: boolean;
  is_verified?: boolean;
  email?: string;
  password: string;
};
