import { Dispatch, SetStateAction } from "react";

export interface User {
  address: string;
  city: string;
  credit: 0;
  dateOfBirth: Date;
  email: string;
  firstName: string;
  gender: string;
  id: number;
  isApproved: boolean;
  lastName: string;
  password: string;
  phoneNumber: string;
  role: string;
}

export interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}
