import { Module } from '@nestjs/common';
import { SlotController } from './slot.controller';
import { SlotService } from './slot.service';
import { OwnerCheckerModule } from '../owner-checker/owner-checker.module';

@Module({
  imports: [OwnerCheckerModule],
  providers: [SlotService],
  controllers: [SlotController],
  exports: [SlotService],
})
export class SlotModule {}
