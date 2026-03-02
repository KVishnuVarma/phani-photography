import { Response } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import PaymentScanner, { IPaymentScanner } from '../models/PaymentScanner';

// ✅ Get all payment scanners (Admin)
export const getAllScanners = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const scanners = await PaymentScanner.find()
      .populate('uploadedBy', 'username email')
      .sort({ createdAt: -1 });
    res.status(200).json(scanners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching scanners', error });
  }
};

// ✅ Get active scanners (Public - for users)
export const getActiveScanners = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const scanners = await PaymentScanner.find({ isActive: true })
      .select('scannerUrl scannerType description')
      .sort({ createdAt: -1 });
    res.status(200).json(scanners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active scanners', error });
  }
};

// ✅ Upload/Create new scanner (Admin)
export const uploadScanner = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { scannerUrl, scannerType, description } = req.body;

    if (!scannerUrl || !scannerType) {
      res.status(400).json({ message: 'Scanner URL and type are required' });
      return;
    }

    // Delete previous scanner of same type
    await PaymentScanner.deleteMany({ scannerType });

    const newScanner: IPaymentScanner = new PaymentScanner({
      scannerUrl,
      scannerType,
      description,
      isActive: true,
      uploadedBy: req.user?.id,
    });

    const savedScanner = await newScanner.save();
    res.status(201).json({
      message: 'Scanner uploaded successfully',
      scanner: savedScanner,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading scanner', error });
  }
};

// ✅ Update scanner (Admin)
export const updateScanner = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { scannerId } = req.params;
    const { scannerUrl, scannerType, description, isActive } = req.body;

    const scanner = await PaymentScanner.findByIdAndUpdate(
      scannerId,
      { scannerUrl, scannerType, description, isActive },
      { new: true }
    ).populate('uploadedBy', 'username email');

    if (!scanner) {
      res.status(404).json({ message: 'Scanner not found' });
      return;
    }

    res.status(200).json({
      message: 'Scanner updated successfully',
      scanner,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating scanner', error });
  }
};

// ✅ Delete scanner (Admin)
export const deleteScanner = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { scannerId } = req.params;

    const scanner = await PaymentScanner.findByIdAndDelete(scannerId);

    if (!scanner) {
      res.status(404).json({ message: 'Scanner not found' });
      return;
    }

    res.status(200).json({
      message: 'Scanner deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting scanner', error });
  }
};

// ✅ Toggle scanner active status (Admin)
export const toggleScannerStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { scannerId } = req.params;

    const scanner = await PaymentScanner.findById(scannerId);
    if (!scanner) {
      res.status(404).json({ message: 'Scanner not found' });
      return;
    }

    scanner.isActive = !scanner.isActive;
    const updatedScanner = await scanner.save();

    res.status(200).json({
      message: `Scanner ${updatedScanner.isActive ? 'activated' : 'deactivated'} successfully`,
      scanner: updatedScanner,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling scanner status', error });
  }
};
