import { stat } from 'fs/promises';

export const isFileExist = async (path: string): Promise<boolean> => {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
};
