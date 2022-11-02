import { BadRequestException } from '@nestjs/common';

export class SlotNotFoundError extends BadRequestException {
  constructor(id: number) {
    super(`Слот с id ${id} не найден`);
  }
}
