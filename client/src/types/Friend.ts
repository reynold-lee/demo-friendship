import { Gender } from "@prisma/client";

export type FriendType = {
  id: number;
  name: string;
  email: string;
  gender: Gender;
  age: number;
  hobbies: string;
  description: string;
  user_id: number;
};
