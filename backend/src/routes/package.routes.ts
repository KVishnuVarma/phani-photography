import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage
} from '../controllers/package.controller';

const router = express.Router();

router.get('/packages', asyncHandler(getAllPackages));
router.get('/packages/:id', asyncHandler(getPackageById));
router.post('/packages', asyncHandler(createPackage));
router.put('/packages/:id', asyncHandler(updatePackage));
router.delete('/packages/:id', asyncHandler(deletePackage));

export default router;
