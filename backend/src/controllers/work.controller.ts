import { Request, Response } from 'express';
import Work from '../models/work.model';

export const addWork = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const imageUrl = req.file?.filename || '';

    const newWork = await Work.create({ title, imageUrl });
    res.status(201).json(newWork);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add work' });
  }
};

export const getAllWorks = async (_: Request, res: Response) => {
  try {
    const works = await Work.find().sort({ createdAt: -1 });
    res.status(200).json(works);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch works' });
  }
};
