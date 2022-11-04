import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OwnerGuard } from '../owner-checker/owner.guard';
import { ReportID } from '../report/decorators/report-id.decorator';
import { SlotID } from './decorators/slot-id.decorator';
import { CreateSlotDto } from './dto/create-slot.dto';
import { SetActiveFileDto } from './dto/set-active-file.dto';
import { SlotEntity } from './entity/slot.entity';
import { SLOT_ID_PARAM_ROUTE } from './index';
import { SlotService } from './slot.service';

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

  @Patch(`:${SLOT_ID_PARAM_ROUTE}`)
  async setActiveFile(
    @SlotID() id: number,
    @Body() dto: SetActiveFileDto,
  ): Promise<SlotEntity> {
    await this.slotService.setActiveFile(id, dto);
    return this.slotService.getSlogByID(id);
  }

  @Delete(`:${SLOT_ID_PARAM_ROUTE}`)
  async deleteSlot(@SlotID() id: number): Promise<SlotEntity> {
    return this.slotService.deleteSlot(id);
  }
}
