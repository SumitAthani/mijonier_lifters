import express from "express";
import { getAllNormalUsers } from "../controllers/user.js";

const userRouter = express.Router();

userRouter.get("/", getAllNormalUsers);

export default userRouter;
