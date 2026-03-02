// src/routes/gallery.routes.ts
import { Router } from "express";
import * as galleryController from "../controllers/gallery.controller";
import { verifyToken } from "../middleware/auth";
import { isAdmin } from "../middleware/isAdmin";

const router = Router();

router.post('/post', verifyToken, isAdmin, galleryController.uploadImage);
router.get('/get', galleryController.getGallery);
router.delete('/delete/:id', verifyToken, isAdmin, galleryController.deleteImage);

export default router;
