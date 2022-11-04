import { Inject, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import Multer from 'multer';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { FILE_ID_PARAM_ROUTE } from '../file';
import { StorageModuleConfig } from './config.interface';
import { UploadedFileMeta } from './index';
import { MODULE_OPTIONS_TOKEN } from './storage.module-definition';

@Injectable()
export class CustomStorageEngine implements Multer.StorageEngine {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly config: StorageModuleConfig,
  ) {}

  async _handleFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: UploadedFileMeta) => void,
  ): Promise<void> {
    let id: number;
    try {
      id = CustomStorageEngine.extractFileID(req);
      const { hash, size } = await this.config.service.save(id, file.stream);
      callback(null, {
        filename: file.originalname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        hash,
        size,
      });
    } catch (e) {
      this.logger.error(
        `Cannot save file ${id}: ${e.message}`,
        e.stack,
        CustomStorageEngine.name,
      );
      callback(e);
    }
  }

  private static extractFileID(req: Request): number {
    const id = parseInt(req.params[FILE_ID_PARAM_ROUTE]);
    if (isNaN(id)) throw Error('Не удалось извлечь FileID');
    return id;
  }

  async _removeFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null) => void,
  ): Promise<void> {
    let id: number;
    try {
      id = CustomStorageEngine.extractFileID(req);
      await this.config.service.delete(id);
    } catch (e) {
      this.logger.error(
        `Cannot delete file ${id}: ${e.message}`,
        e.stack,
        CustomStorageEngine.name,
      );
      callback(e);
    }
  }
}
