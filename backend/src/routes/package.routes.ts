import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage
} from '../controllers/package.controller';
import { verifyToken } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';

const router = express.Router();

router.get('/', asyncHandler(getAllPackages));
router.get('/:id', asyncHandler(getPackageById));
router.post('/', verifyToken, isAdmin, asyncHandler(createPackage));
router.put('/:id', verifyToken, isAdmin, asyncHandler(updatePackage));
router.delete('/:id', verifyToken, isAdmin, asyncHandler(deletePackage));

export default router;
