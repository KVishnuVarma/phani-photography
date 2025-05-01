import { Request, Response, NextFunction } from "express";
import Package from "../models/Package";

// CREATE
export const createPackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, category, photosIncluded, price, description, features, thumbnailUrl } = req.body;

    const newPackage = new Package({
      title,
      category,
      photosIncluded,
      price,
      description,
      features,
      thumbnailUrl,
    });

    const saved = await newPackage.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ error: 'Failed to create package' });
  }
};

// READ ALL
export const getAllPackages = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
};

// READ ONE
export const getPackageById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      res.status(404).json({ error: 'Package not found' });
      return;
    }
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving package' });
  }
};

// UPDATE
export const updatePackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Package not found' });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update package' });
  }
};

// DELETE
export const deletePackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await Package.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Package not found' });
      return;
    }
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete package' });
  }
};
