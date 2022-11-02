import { BadRequestException } from '@nestjs/common';

export class SlotIdMissedError extends BadRequestException {
  constructor() {
    super(`Пропущен параметр SlotID`);
  }
}
