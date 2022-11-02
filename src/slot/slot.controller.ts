import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { CreateSlotDto } from './dto/create-slot.dto';
import { SlotEntity } from './entity/slot.entity';
import { SlotService } from './slot.service';
import { OwnerGuard } from '../owner-checker/owner.guard';
import { ReportID } from '../report/decorators/report-id.decorator';
import { SLOT_ID_PARAM_ROUTE } from './index';
import { SlotID } from './decorators/slot-id.decorator';

@Controller()
@UseGuards(OwnerGuard)
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Post()
  async createSlot(
    @Body() dto: CreateSlotDto,
    @ReportID() report_id: number,
  ): Promise<SlotEntity> {
    dto.report_id = report_id;
    return this.slotService.createSlot(dto);
  }

  @Delete(`:${SLOT_ID_PARAM_ROUTE}`)
  async deleteSlot(@SlotID() id: number): Promise<SlotEntity> {
    return this.slotService.deleteSlot(id);
  }
}
