import express from "express";
import { loginUser } from "../controllers/auth.js";

const loginRouter = express.Router();

loginRouter.post("/login", loginUser);

export default loginRouter;
