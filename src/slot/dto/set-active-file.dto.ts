import { Transform } from 'class-transformer';
import { IsDefined } from 'class-validator';
import { SlotEntity } from '../entity/slot.entity';

export class SetActiveFileDto implements Pick<SlotEntity, 'active_file_id'> {
  @IsDefined()
  @Transform(({ value }) => parseInt(value))
  active_file_id: number;
}
