// src/types/customer.ts
export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  nic: string;
  address: string;
  longitude?: number;
  latitude?: number;
}
