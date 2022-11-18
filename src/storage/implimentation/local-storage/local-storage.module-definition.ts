import { ConfigurableModuleBuilder } from '@nestjs/common';
import { LocalStorageConfig } from './config.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<LocalStorageConfig>()
    .setFactoryMethodName('register')
    .build();
