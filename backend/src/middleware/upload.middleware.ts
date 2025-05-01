import multer from 'multer';
import path from 'path';

// Configure storage with unique file names
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// Export the multer upload middleware
export const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      cb(null, false); // Reject the file silently
    } else {
      cb(null, true);
    }
  }
});
