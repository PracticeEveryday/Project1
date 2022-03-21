import { Router } from "express";

import { likeService } from "../service/likeService.js";

import { verifyToken } from "../middleware/verifyToken.js";
import { checkLogin } from "../middleware/checkLogin.js";

const likeRouter = Router();

likeRouter.use(verifyToken);
likeRouter.use(checkLogin);

likeRouter.post("/like/pushLike", async (req, res, next) => {
  try {
    const pushUser = req.user.ObjectId;
    const pushedUser = req.body.pushedUser;

    const likedUser = await likeService.addLike({
      pushUser,
      pushedUser,
    });
    res.status(200).json(likedUser);
  } catch (error) {
    next(error);
  }
});

likeRouter.post("/like/backLike", async (req, res, next) => {
  try {
    const { likeId } = req.body;
    const deletedLike = await likeService.deleteLike({ likeId });
    if (deletedLike.errorMessage) {
      throw new Error(deletedLike.errorMessage);
    }

    res.status(200).json({
      status: "succ",
    });
  } catch (error) {
    next(error);
  }
});

likeRouter.get("/likes", async (req, res, next) => {
  try {
    const pushUser = req.user.ObjectId;
    console.log(pushUser);
    const likes = await likeService.likes({ pushUser });
    // console.log("likes", likes);
    res.status(200).json({
      status: "succ",
      message: `내가 누른 좋아요 개수는 ${
        likes.length
      }개 입니다.그 유저 이름은 ${likes.map((item) => item.pushUser)}입니다.`,
    });
  } catch (error) {
    next(error);
  }
});

export { likeRouter };
