import { Slot, SlotType } from '@prisma/client';
import { IsDefined, IsEmpty, IsEnum, IsString } from 'class-validator';

export class CreateSlotDto
  implements Omit<Slot, 'id' | 'active_file_id' | 'status'>
{
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsEnum(SlotType)
  type: SlotType;

  @IsEmpty()
  report_id: number;
}
