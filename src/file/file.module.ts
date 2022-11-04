import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { OwnerCheckerModule } from '../owner-checker/owner-checker.module';
import { CustomStorageEngine } from '../storage/storage.engine';
import { StorageModule } from '../storage/storage.module';
import { LocalStorageModule } from '../storage/storages/local-storage/local-storage.module';
import { LocalStorageService } from '../storage/storages/local-storage/local-storage.service';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [
        StorageModule.registerAsync({
          imports: [
            LocalStorageModule.registerAsync({
              useFactory: async () => {
                return {
                  root: './storage',
                };
              },
            }),
          ],
          useFactory: async (storageService: LocalStorageService) => {
            return {
              service: storageService,
            };
          },
          inject: [LocalStorageService],
        }),
      ],
      useFactory: async (storageEngine: CustomStorageEngine) => {
        return {
          storage: storageEngine,
        };
      },
      inject: [CustomStorageEngine],
    }),
    OwnerCheckerModule,
  ],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
