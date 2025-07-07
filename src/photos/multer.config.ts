// src/photos/multer.config.ts
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${randomUUID()}`;
      const ext = extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      cb(null, filename);
    },
  }),
};
