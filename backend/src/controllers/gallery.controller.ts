// src/controllers/gallery.controller.ts
import { Request, Response } from "express";
import Gallery from "../models/Gallery";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { imageUrl, caption } = req.body;
    const image = await Gallery.create({ imageUrl, caption });
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload image', error });
  }
};

export const getGallery = async (_: Request, res: Response) => {
  try {
    const images = await Gallery.find().sort({ uploadedAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch gallery', error });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Gallery.findByIdAndDelete(id);
    if (deleted) {
      res.status(200).json({ message: 'Deleted successfully' });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete image', error });
  }
};
