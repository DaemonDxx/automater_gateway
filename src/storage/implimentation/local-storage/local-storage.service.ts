import { Inject, Injectable, Logger } from '@nestjs/common';
import { FilePath } from '@prisma/client';
import { createHash } from 'crypto';
import { createWriteStream } from 'fs';
import { unlink } from 'fs/promises';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { join } from 'path';
import { Readable } from 'stream';
import { PrismaService } from '../../../database/prisma.service';
import { StorageSaveResult, StorageService } from '../../storage.interface';
import { DeleteFileError } from '../errors/delete-file.error';
import { SaveFileError } from '../errors/save-file.error';
import { LocalStorageConfig } from './config.interface';
import { MODULE_OPTIONS_TOKEN } from './local-storage.module-definition';
import { isFileExist } from './utils/is-file-exist.function';

@Injectable()
export class LocalStorageService implements StorageService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly config: LocalStorageConfig,
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  save(id: number, stream: Readable): Promise<StorageSaveResult> {
    return new Promise(async (resolve, reject) => {
      //TODO изменить на ошибку пользователя
      const pathInfo = await this.getPathByFileID(id);
      if (pathInfo) reject(new SaveFileError(id, `File exist`));
      try {
        const path = join(this.config.root, id.toString());
        const hash = createHash('md5');

        const writeStream = createWriteStream(path);
        writeStream.on('error', (err) => {
          this.logger.error(
            `Write stream error: ${err.message}`,
            err.stack,
            `${LocalStorageService.name}:write_stream`,
          );
          reject(err);
        });
        writeStream.on('close', async () => {
          try {
            await this.prisma.filePath.create({
              data: {
                path,
                file_id: id,
              },
            });
            hash.end();
            resolve({
              hash: hash.digest('hex'),
              size: writeStream.bytesWritten,
            });
          } catch (e) {
            await this.delete(id);
            reject(e);
          }
        });

        stream.on('error', (err) => {
          this.logger.error(
            `save file ${id} error: ${err.message}`,
            err.stack,
            `${LocalStorageService.name}:stream`,
          );
          reject(new SaveFileError(id, err.message));
        });
        stream.pipe(writeStream);
      } catch (e) {
        this.logger.error(
          `save file ${id} error: ${e.message}`,
          e.stack,
          LocalStorageService.name,
        );
        reject(new SaveFileError(id, e.message));
      }
    });
  }

  private async getPathByFileID(file_id): Promise<FilePath> {
    return this.prisma.filePath.findUnique({
      where: {
        file_id,
      },
    });
  }

  async delete(id: number): Promise<void> {
    const pathInfo = await this.getPathByFileID(id);
    if (!pathInfo)
      throw new DeleteFileError(id, `Нет данных о расположении файла`);
    try {
      if (await isFileExist(pathInfo.path)) await unlink(pathInfo.path);
    } catch (e) {
      this.logger.error(
        `delete file ${id} error:${e.message}`,
        e.stack,
        LocalStorageService.name,
      );
      throw new DeleteFileError(id, e.message);
    }
  }
}
