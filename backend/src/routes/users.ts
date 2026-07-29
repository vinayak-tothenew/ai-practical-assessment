import { Router } from "express";

import * as userController from "../controllers/userController.js";

export const usersRouter = Router();

usersRouter.get("/", userController.listUsers);
