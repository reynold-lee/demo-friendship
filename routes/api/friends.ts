import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();

const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response) => {
  const friends = await prisma.friend.findMany({
    where: {
      user_id: req.body.id,
    },
  });

  res.status(200).json(friends);
});

router.post("/friend", async (req: Request, res: Response) => {
  const friend = await prisma.friend.create({
    data: req.body,
  });

  res.status(201).json(friend);
});

router.put("/friend/:id", async (req: Request, res: Response) => {
  const friend = await prisma.friend.update({
    where: {
      id: Number(req.params.id),
    },
    data: req.body,
  });

  res.status(200).json(friend);
});

router.delete("/friend/:id", async (req: Request, res: Response) => {
  await prisma.friend.delete({
    where: {
      id: Number(req.params.id),
    },
  });

  res.status(200).json();
});

export default router;
