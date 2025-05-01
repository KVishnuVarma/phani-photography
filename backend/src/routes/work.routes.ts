import express from 'express';
import { addWork, getAllWorks } from '../controllers/work.controller';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

router.post('/add', upload.single('image'), addWork);
router.get('/all', getAllWorks);

export default router;
