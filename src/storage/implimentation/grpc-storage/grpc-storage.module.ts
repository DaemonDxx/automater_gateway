import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcStorageConfig } from './config.interface';
import {
  GrpcModuleClass,
  GrpcOptionToken,
} from './grpc-storage.module-definition';
import { GrpcStorageService } from './grpc-storage.service';
import { STORAGE_PACKAGE_NAME } from './index';

@Module({
  imports: [],
  providers: [
    GrpcStorageService,
    {
      provide: STORAGE_PACKAGE_NAME,
      useFactory: (config: GrpcStorageConfig) => {
        const url = `${config.host}:${config.port}`;
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url,
            package: STORAGE_PACKAGE_NAME,
            protoPath: join('./proto/storage.proto'),
          },
        });
      },
      inject: [GrpcOptionToken],
    },
  ],
  exports: [GrpcStorageService],
})
export class GrpcStorageModule extends GrpcModuleClass {}
