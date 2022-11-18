import { ConfigurableModuleBuilder } from '@nestjs/common';
import { GrpcStorageConfig } from './config.interface';

export const {
  ConfigurableModuleClass: GrpcModuleClass,
  MODULE_OPTIONS_TOKEN: GrpcOptionToken,
} = new ConfigurableModuleBuilder<GrpcStorageConfig>()
  .setFactoryMethodName('register')
  .build();
