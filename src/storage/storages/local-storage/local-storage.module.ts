import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './local-storage.module-definition';
import { LocalStorageService } from './local-storage.service';

@Module({
  providers: [LocalStorageService],
  exports: [LocalStorageService],
})
export class LocalStorageModule extends ConfigurableModuleClass {}
