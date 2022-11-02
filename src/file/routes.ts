import { RouteTree } from '@nestjs/core';
import { FileModule } from './file.module';
import { FILE_ROUTE } from './index';

export const fileRoute: RouteTree = {
  path: FILE_ROUTE,
  module: FileModule,
};
