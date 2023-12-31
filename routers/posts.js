const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

// 呟き投稿用API
router.post("/post", isAuthenticated, async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "投稿内容がありません。" });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId: req.userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: true,
          },
        },
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
});

// 最新つぶやき取得用API
router.get("/latest_posts", async (req, res) => {
  try {
    const latestPosts = await prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: true,
          },
        },
      },
    });
    res.json(latestPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
});

// 閲覧しているユーザの投稿取得用API
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: parseInt(userId),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: true,
          },
        },
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
