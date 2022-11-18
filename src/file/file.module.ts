import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { OwnerCheckerModule } from '../owner-checker/owner-checker.module';
import { GrpcStorageModule } from '../storage/implimentation/grpc-storage/grpc-storage.module';
import { GrpcStorageService } from '../storage/implimentation/grpc-storage/grpc-storage.service';
import { CustomStorageEngine } from '../storage/storage.engine';
import { StorageModule } from '../storage/storage.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [
        StorageModule.registerAsync({
          imports: [
            GrpcStorageModule.registerAsync({
              useFactory: (config: ConfigService) => {
                return config.get<{
                  host: string;
                  port: number;
                }>('storage');
              },
              inject: [ConfigService],
            }),
          ],
          useFactory: async (storageService: GrpcStorageService) => {
            return {
              service: storageService,
            };
          },
          inject: [GrpcStorageService],
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
