import { Router } from 'express';
import { register, login, getUserProfile } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:userId', getUserProfile);

export default router;
