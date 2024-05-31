import { Request, Response, Router } from "express";
import { generateOneTimeAcc, webhookHandler } from "../controllers/gateway";

const router = Router();

router.get('/generate-account-number/:courseId/:paymentType', (req: Request, res: Response) => generateOneTimeAcc(req, res));

router.post('/webhook', (req: Request, res: Response) => webhookHandler(req, res)); 
export default router