import { Module } from '@nestjs/common';
import { FileModule } from '../file/file.module';
import { OwnerCheckerModule } from '../owner-checker/owner-checker.module';
import { SlotController } from './slot.controller';
import { SlotService } from './slot.service';

@Module({
  imports: [FileModule, OwnerCheckerModule],
  providers: [SlotService],
  controllers: [SlotController],
  exports: [SlotService],
})
export class SlotModule {}
