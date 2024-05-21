import { Router, Request, Response } from "express";
import { logInHandler, createAccountHandler } from "../controllers/auth";

const router = Router();

router.post('/login', (req: Request, res: Response) => logInHandler(req, res));

router.post('/create-account', (req: Request, res: Response)=> createAccountHandler(req, res));

export default router;
