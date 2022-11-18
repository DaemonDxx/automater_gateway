import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { catchError, throwError } from 'rxjs';
import { Readable } from 'stream';
import {
  FileMeta,
  StorageSaveResult,
  StorageService,
} from '../../storage.interface';
import {
  StorageServiceClient,
  STORAGE_PACKAGE_NAME,
  STORAGE_SERVICE_NAME,
} from './index';
import { CreateUploadORequest } from './utils/upload-request.factory';

@Injectable()
export class GrpcStorageService implements StorageService, OnModuleInit {
  private grpcStorage: StorageServiceClient;

  constructor(
    @Inject(STORAGE_PACKAGE_NAME) private readonly client: ClientGrpc,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  delete(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.grpcStorage.delete({ id }).subscribe(
        null,
        (err) => {
          this.logger.error(
            `Delete file error: ${err.message}`,
            err.stack,
            GrpcStorageService.name,
          );
          reject(err);
        },
        () => resolve(),
      );
    });
  }

  save(
    id: number,
    stream: Readable,
    meta: FileMeta,
  ): Promise<StorageSaveResult> {
    return new Promise((resolve, reject) => {
      const request$ = CreateUploadORequest(id, stream, meta);
      const response$ = this.grpcStorage.upload(
        request$.pipe(
          catchError((err) => {
            this.logger.error(
              `Save file error: ${err.message}`,
              err.stack,
              GrpcStorageService.name,
            );
            reject(err);
            return throwError(err);
          }),
        ),
      );
      response$.subscribe(
        (res) => resolve(res),
        (err) => {
          this.logger.error(
            `Save file error: ${err.message}`,
            err.stack,
            GrpcStorageService.name,
          );
          reject(err);
        },
      );
    });
  }

  onModuleInit(): any {
    this.grpcStorage =
      this.client.getService<StorageServiceClient>(STORAGE_SERVICE_NAME);
  }
}
