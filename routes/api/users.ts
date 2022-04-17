import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import { PrismaClient, Role } from "@prisma/client";

const router = Router();

const prisma = new PrismaClient();

// @API     GET users/
// @DESC    Get all users
// @PARAMS
router.get("/", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    where: {
      role: Role.USER,
    },
    orderBy: [{ id: "asc" }],
  });

  res.status(200).send(users);
});

// @API     GET users/user/:id
// @DESC    Get user by id
// @PARAMS  user id
router.get("/user/:id", async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  res.status(200).send(user);
});

// @API     POST users/user
// @DESC    Create new user (only admin)
// @PARAMS  User data
router.post("/user", async (req: Request, res: Response) => {
  const errors: { email: string } = { email: "" };
  // check email already exist
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (user) {
    errors.email = "Email already exist";
    return res.status(400).json(errors);
  }

  const avatar = gravatar.url(req.body.email, {
    s: "200",
    r: "pg",
    d: "mm",
  });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);

  const newUser = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      avatar: avatar,
      password: hash,
      role: Role.USER,
    },
  });

  return res.status(200).json(newUser);
});

// @API     PUT users/user/:id
// @DESC    Update user data
// @PARAMS  user id & new user data
router.put("/user/:id", async (req: Request, res: Response) => {
  const user = await prisma.user.update({
    where: {
      id: Number(req.params.id),
    },
    data: req.body,
  });

  res.status(200).json(user);
});

// @API     DELETE users/user/:id
// @DESC    Delete user by id
// @PARAMS  user id
router.delete("/user/:id", async (req: Request, res: Response) => {
  await prisma.user.delete({
    where: {
      id: Number(req.params.id),
    },
  });

  res.status(200).json({
    id: req.params.id,
  });
});

// @API     PUT users/user/:id/resetpassword
// @DESC    Reset user's password (1234567890)
// @PARAMS  user id
router.put("/user/:id/resetpassword", async (req: Request, res: Response) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash("1234567890", salt);

  const user = await prisma.user.update({
    where: {
      id: Number(req.params.id),
    },
    data: {
      password: hash,
    },
  });

  res.status(200).json(user);
});

// @API     GET users/total
// @DESC    Get total number of users (only user, not admin)
// @PARAMS
router.get("/total", async (req: Request, res: Response) => {
  const total = await prisma.user.count({
    where: {
      role: Role.USER,
    },
  });

  res.status(200).json(total);
});
export default router;
