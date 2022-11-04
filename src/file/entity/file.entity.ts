import { File, FileStatus } from '@prisma/client';

export class FileEntity implements File {
  id: number;
  name: string;
  size: number;
  mime: string;
  status: FileStatus;
  create_at: Date;
  slot_id: number;

  constructor(file: File) {
    Object.assign(this, file);
  }
}
