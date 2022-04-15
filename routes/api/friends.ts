import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();

const prisma = new PrismaClient();

// @API     GET friends/
// @DESC    Get all friends by user
// @PARAMS  user id
router.get("/", async (req: Request, res: Response) => {
  const friends = await prisma.friend.findMany({
    where: {
      user_id: req.body.id,
    },
  });

  res.status(200).json(friends);
});

// @API     POST friends/friend
// @DESC    Create new friend
// @PARAMS  Friend data
router.post("/friend", async (req: Request, res: Response) => {
  const friend = await prisma.friend.create({
    data: req.body,
  });

  res.status(201).json(friend);
});

// @API     PUT friends/friend/:id
// @DESC    Update friend
// @PARAMS  id & new friend data
router.put("/friend/:id", async (req: Request, res: Response) => {
  const friend = await prisma.friend.update({
    where: {
      id: Number(req.params.id),
    },
    data: req.body,
  });

  res.status(200).json(friend);
});

// @API     DELETE friends/friend/:id
// @DESC    Delete friend by id
// @PARAMS  friend id
router.delete("/friend/:id", async (req: Request, res: Response) => {
  await prisma.friend.delete({
    where: {
      id: Number(req.params.id),
    },
  });

  res.status(200).json();
});

export default router;
