import { Router, Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import gravatar from "gravatar";

import config from "../../config/keys";
import validateSigninInput from "../validation/signin";
import validateSignupInput from "../validation/signup";

const router = Router();

const prisma = new PrismaClient();

router.post("/signin", async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  const { errors, isValid } = validateSigninInput(req.body);

  // validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    errors.email = "User not found";
    return res.status(400).json(errors);
  }

  // check password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    errors.password = "Password incorrect";
    res.status(400).json(errors);
  }

  // User matched
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    role: user.role,
  };

  // jsonwebtoken generate
  jwt.sign(
    payload,
    config.secretOrKey as Secret,
    { expiresIn: 3600 },
    (error, token) => {
      if (error) {
        errors.token = "Error generating token";
        return res.status(400).json(errors);
      }

      return res.status(200).json({
        success: true,
        token: "Bearer " + token,
      });
    }
  );
});

router.post("/signup", async (req: Request, res: Response) => {
  const { errors, isValid } = validateSignupInput(req.body);

  // validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

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
      name: req.body.email,
      avatar: avatar,
      password: hash,
      role: Role.USER,
    },
  });

  return res.status(200).json(newUser);
});

export default router;
