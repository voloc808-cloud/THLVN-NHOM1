export interface AppUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  role: 'USER' | 'ADMIN';
  isLocked: boolean;
}
export interface Registration {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}
