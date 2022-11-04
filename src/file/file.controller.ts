import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OwnerGuard } from '../owner-checker/owner.guard';

import { SlotID } from '../slot/decorators/slot-id.decorator';
import { FileID } from './decorators/file-id.decorator';
import { FileEntity } from './entity/file.entity';
import { FileService } from './file.service';
import { FILE_ID_PARAM_ROUTE } from './index';

@Controller()
@UseGuards(OwnerGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  async createFile(@SlotID() slot_id: number): Promise<FileEntity> {
    return this.fileService.createFile(slot_id);
  }

  @Post(`:${FILE_ID_PARAM_ROUTE}/binary`)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @FileID() file_id: number,
    @SlotID() slot_id: number,
    @UploadedFile() file: Express.Multer.File & { hash: string },
  ): Promise<FileEntity> {
    return this.fileService.uploadFile(file_id, slot_id, {
      mime: file.mimetype,
      size: file.size,
      hash: file.hash,
    });
  }
}
