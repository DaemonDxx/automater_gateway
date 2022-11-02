import { Module } from '@nestjs/common';
import { OwnerCheckerService } from './owner-checker.service';

@Module({
  providers: [OwnerCheckerService],
  exports: [OwnerCheckerService],
})
export class OwnerCheckerModule {}
