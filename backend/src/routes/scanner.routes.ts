import express, { Router } from 'express';
import { 
  getAllScanners, 
  getActiveScanners, 
  uploadScanner, 
  updateScanner, 
  deleteScanner,
  toggleScannerStatus 
} from '../controllers/scanner.controller';
import { isAdmin } from '../middleware/isAdmin';
import { verifyToken } from '../middleware/auth';

const router: Router = express.Router();

// Public routes
router.get('/active', getActiveScanners);

// Admin routes
router.get('/all', verifyToken, isAdmin, getAllScanners);
router.post('/upload', verifyToken, isAdmin, uploadScanner);
router.put('/:scannerId', verifyToken, isAdmin, updateScanner);
router.delete('/:scannerId', verifyToken, isAdmin, deleteScanner);
router.patch('/:scannerId/toggle', verifyToken, isAdmin, toggleScannerStatus);

export default router;
