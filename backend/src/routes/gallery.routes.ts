// src/routes/gallery.routes.ts
import { Router } from "express";
import * as galleryController from "../controllers/gallery.controller";

const router = Router();

router.post('/post', galleryController.uploadImage);
router.get('/get', galleryController.getGallery);
router.delete('/delete/:id', galleryController.deleteImage);

export default router;
