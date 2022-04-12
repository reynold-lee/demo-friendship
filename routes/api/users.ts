import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();

const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: {
      friends: true,
    },
  });

  res.status(200).send(users);
});

router.get("/user/:id", async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  res.status(200).send(user);
});

router.post("/user", async (req: Request, res: Response) => {
  const user = await prisma.user.create({
    data: req.body,
  });

  res.status(201).json(user);
});

router.put("/user/:id", async (req: Request, res: Response) => {
  const user = await prisma.user.update({
    where: {
      id: Number(req.params.id),
    },
    data: req.body,
  });

  res.status(200).json(user);
});

router.delete("/user/:id", async (req: Request, res: Response) => {
  await prisma.user.delete({
    where: {
      id: Number(req.params.id),
    },
  });

  res.status(200).json();
});

export default router;
