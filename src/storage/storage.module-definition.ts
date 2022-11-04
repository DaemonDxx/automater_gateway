import { ConfigurableModuleBuilder } from '@nestjs/common';
import { StorageModuleConfig } from './config.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<StorageModuleConfig>()
    .setFactoryMethodName('register')
    .build();
