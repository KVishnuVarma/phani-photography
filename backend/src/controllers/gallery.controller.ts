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
    const deleted = await Gallery.find({_id : id})
    if (deleted.length == 1) {
      const delete1 = await Gallery.deleteOne({id : deleted[0]._id})
      if(delete1) {
          res.status(200).json({ message: 'Deleted successfully' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete image', error });
  }
};
