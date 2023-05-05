import { Request } from "express";
import multer from "multer";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req: Request, file: any, cb: any) => {
    // let ext = file.originalname.split('.').pop()
    const ext = path.extname(file.originalname);
    // if (ext !== ".jpg" || ext != ".jpeg" || ext !== ".png") {
    //   cb(new Error("File type is not supported"), false);
    //   return;
    // }
    cb(null, true);
  },
  limits: { fileSize: 1024 },
});

export default upload;
