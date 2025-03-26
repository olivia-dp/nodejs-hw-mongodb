import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserSchema,
  registerUserSchema,
  requestResetEmailSchema,
  resetEmailSchema,
} from '../validation/auth.js';
import {
  loginUserController,
  registerUserController,
  refreshSessionController,
  logoutUserController,
  requestResetPasswordController,
  resetEmailController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/refresh', ctrlWrapper(refreshSessionController));

router.post('/logout', ctrlWrapper(logoutUserController));

router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetPasswordController),
);

router.post(
  '/reset-pwd',
  validateBody(resetEmailSchema),
  ctrlWrapper(resetEmailController),
);

export default router;
