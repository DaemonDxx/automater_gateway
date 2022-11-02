import { Report, Slot, SlotStatus, SlotType } from '@prisma/client';

export class SlotEntity implements Slot {
  active_file_id: number | null;
  id: number;
  name: string;
  report_id: number;
  type: SlotType;
  report?: Report;
  status: SlotStatus;

  constructor(slot: Slot) {
    Object.assign(this, slot);
  }
}
