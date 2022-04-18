import { Role } from "@prisma/client";

export type UserType = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  password: string;
  role: Role;
  _count: {
    friends: number;
  };
};
