import { randomUUID } from 'crypto';
import multer, { diskStorage } from 'multer';
import path from 'path';
const storage = diskStorage({
  destination(_req, _file, cb) {
    cb(null, 'uploads/');
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${randomUUID()}.${ext}`);
  },
});
const upload = multer({ storage });

export default upload;
