// import { diskStorage } from 'multer';
// import { extname } from 'path';

// export const multerOptions = {
//   storage: diskStorage({
//     destination: './uploads', // Directory to save files
//     filename: (req, file, callback) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       const ext = extname(file.originalname);
//       callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
//     },
//   }),
//   fileFilter: (req, file, callback) => {
//     // File validation (optional)
//     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//       return callback(new Error('Only image files are allowed!'), false);
//     }
//     callback(null, true);
//   },
// };
