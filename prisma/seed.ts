import { PrismaClient, Role } from "@prisma/client";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

(async function main() {
  try {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash("admin", salt, async (error, hash) => {
        const avatar = gravatar.url("reynold.lee720@gmail.com", {
          s: "200",
          r: "pg",
          d: "mm",
        });

        const admin = await prisma.user.create({
          data: {
            email: "admin@gmail.com",
            name: "admin",
            avatar: avatar,
            password: hash,
            role: Role.ADMIN,
          },
        });

        console.log("Created admin:", admin);
      });
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
