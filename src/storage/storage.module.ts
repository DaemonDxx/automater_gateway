import { Module } from '@nestjs/common';
import { CustomStorageEngine } from './storage.engine';
import { ConfigurableModuleClass } from './storage.module-definition';

@Module({
  providers: [CustomStorageEngine],
  exports: [CustomStorageEngine],
})
export class StorageModule extends ConfigurableModuleClass {}
