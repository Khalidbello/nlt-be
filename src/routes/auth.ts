import { Router, Request, Response, response } from "express";
import { logInHandler, createAccountHandler, passwordRecoveryCheckUser, passwordRecoveryConfirmOtp } from "../controllers/users/auth";
import { adminLoginHandler } from "../controllers/admin/auth";

const router = Router();

router.post('/login', (req: Request, res: Response) => logInHandler(req, res));

router.post('/create-account', (req: Request, res: Response) => createAccountHandler(req, res));

router.post('/admin-login', (req: Request, res: Response) => adminLoginHandler(req, res));

router.post('/password-recovery-email', (req: Request, res: Response)=> passwordRecoveryCheckUser(req, res));

router.post('/password-recovery-otp', (req: Request, res: Response)=> passwordRecoveryConfirmOtp(req, res));
export default router;
