import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import Protect from '../middlewares/protect';

const router = Router();

router.post('/sign-up', AuthController.signUp());

router.post(
  '/verify-account',
  Protect.protectMiddleware(),
  AuthController.verifyAccount()
);

export default router;
