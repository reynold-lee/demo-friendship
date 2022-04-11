import { Role, Gender } from "@prisma/client";

export type UserType = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  password: string;
  friends: [
    {
      id: number;
      name: string;
      email: string;
      gender: Gender;
      age: number;
      hobbies: string;
      description: string;
    }
  ];
  role: Role;
};
