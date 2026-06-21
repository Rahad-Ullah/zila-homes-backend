import { NextFunction, Request, Response, RequestHandler } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import ApiError from '../../errors/ApiError';

const fileUploadHandler = (): RequestHandler => {
  //create upload folder
  const baseUploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir);
  }

  //folder create for different file
  const createDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  };

  //create filename
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir: string;
      switch (file.fieldname) {
        case 'image':
          uploadDir = path.join(baseUploadDir, 'image');
          break;
        case 'media':
          uploadDir = path.join(baseUploadDir, 'media');
          break;
        case 'doc':
          uploadDir = path.join(baseUploadDir, 'doc');
          break;
        default:
          return cb(
            new ApiError(
              StatusCodes.BAD_REQUEST,
              'File field is not supported',
            ),
            '',
          );
      }
      createDir(uploadDir);
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, '')
          .toLowerCase()
          .split(' ')
          .join('-') +
        '-' +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });

  //file filter
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (file.fieldname === 'image') {
      if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Only .jpeg, .png, .jpg file supported'
          )
        );
      }
    } else if (file.fieldname === 'media') {
      if (['video/mp4', 'audio/mpeg'].includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Only .mp4, .mp3, file supported'
          )
        );
      }
    } else if (file.fieldname === 'doc') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new ApiError(StatusCodes.BAD_REQUEST, 'Only pdf supported'));
      }
    } else {
      cb(new ApiError(StatusCodes.BAD_REQUEST, 'This file is not supported'));
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter as any,
  }).fields([
    { name: 'image', maxCount: 5 },
    { name: 'media', maxCount: 3 },
    { name: 'doc', maxCount: 3 },
  ]);

  // wrap Multer upload in a proper Express RequestHandler
  return (req: Request, res: Response, next: NextFunction) => {
    upload(req as any, res as any, err => {
      if (err) {
        // 1. If it's a native Multer Error (e.g. limit exceeded, unexpected field)
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return next(
              new ApiError(
                StatusCodes.BAD_REQUEST,
                `File limit exceeded or invalid field name for '${err.field}'.`,
              ),
            );
          }
          if (err.code === 'LIMIT_FILE_SIZE') {
            return next(
              new ApiError(StatusCodes.BAD_REQUEST, `File size is too large.`),
            );
          }
          // Fallback for other Multer errors (LIMIT_FILE_COUNT, LIMIT_FIELD_KEY, etc.)
          return next(
            new ApiError(
              StatusCodes.BAD_REQUEST,
              `Upload error (${err.code}): ${err.message}`,
            ),
          );
        }

        // 2. If it's your custom ApiError thrown from fileFilter or destination
        if (err instanceof ApiError) {
          return next(err);
        }

        // 3. Any other unexpected generic error
        return next(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            err.message || 'File upload failed',
          ),
        );
      }

      // --- AUTO-PARSING LOGIC FOR ZOD VALIDATION ---
      if (req.body) {
        // Keys that should absolutely remain strings even if they look like numbers
        const stringBlacklist = [
          'postalcode',
          'zipcode',
          'phone',
          'phonenumber',
          'id',
        ];

        const deepParse = (obj: any, currentKey: string = ''): any => {
          if (typeof obj === 'string') {
            const trimmedValue = obj.trim();
            const lowerKey = currentKey.toLowerCase();

            try {
              // 1. Parse JSON Strings (Arrays or Objects)
              if (
                (trimmedValue.startsWith('[') && trimmedValue.endsWith(']')) ||
                (trimmedValue.startsWith('{') && trimmedValue.endsWith('}'))
              ) {
                return deepParse(JSON.parse(trimmedValue), currentKey);
              }

              // 2. Parse Booleans
              if (trimmedValue === 'true' || trimmedValue === 'false') {
                return JSON.parse(trimmedValue);
              }

              // 3. Parse Numbers (with safeguards)
              if (trimmedValue !== '' && !isNaN(Number(trimmedValue))) {
                // Safeguard A: Is this key explicitly blacklisted to stay a string?
                if (
                  stringBlacklist.some(blacklisted =>
                    lowerKey.includes(blacklisted),
                  )
                ) {
                  return trimmedValue;
                }

                // Safeguard B: Does it have leading zeros? (e.g., "00123" -> should stay a string)
                if (
                  trimmedValue.length > 1 &&
                  trimmedValue.startsWith('0') &&
                  !trimmedValue.startsWith('0.')
                ) {
                  return trimmedValue;
                }

                return Number(trimmedValue);
              }
            } catch (e) {
              return obj;
            }
            return trimmedValue;
          }

          // If it's an array, map over elements (keep passing the parent key name context down)
          if (Array.isArray(obj)) {
            return obj.map(item => deepParse(item, currentKey));
          }

          // If it's an object, iterate through keys
          if (obj !== null && typeof obj === 'object') {
            for (const key in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, key)) {
                obj[key] = deepParse(obj[key], key); // 👈 Passing the actual key name here
              }
            }
            return obj;
          }

          return obj;
        };

        req.body = deepParse(req.body);
      }

      next();
    });
  };
};

export default fileUploadHandler;
