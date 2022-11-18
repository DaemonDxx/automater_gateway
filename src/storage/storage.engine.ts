import { Inject, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import Multer from 'multer';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { FILE_ID_PARAM_ROUTE } from '../file';
import { StorageModuleConfig } from './config.interface';
import { UploadedFileMeta } from './index';
import { FileMeta } from './storage.interface';
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
    try {
      const id = CustomStorageEngine.extractFileID(req);
      const meta: FileMeta = {
        filename: file.originalname,
        extension: CustomStorageEngine.extractFileExtension(file.originalname),
      };
      const { hash, size } = await this.config.service.save(
        id,
        file.stream,
        meta,
      );
      callback(null, {
        filename: file.originalname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        hash,
        size,
      });
    } catch (e) {
      callback(e);
    }
  }

  private static extractFileID(req: Request): number {
    const id = parseInt(req.params[FILE_ID_PARAM_ROUTE]);
    if (isNaN(id)) throw Error('Не удалось извлечь FileID');
    return id;
  }

  private static extractFileExtension(filename: string): string {
    return filename.split('.').at(-1);
  }

  async _removeFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null) => void,
  ): Promise<void> {
    try {
      const id = CustomStorageEngine.extractFileID(req);
      await this.config.service.delete(id);
    } catch (e) {
      callback(e);
    }
  }
}
