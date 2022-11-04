export const STORAGE_SERVICE_TOKEN = 'STORAGE_SERVICE_TOKEN';

export type UploadedFileMeta = Partial<Express.Multer.File> & {
  hash: string;
};
