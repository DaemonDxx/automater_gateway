import { BadRequestException } from '@nestjs/common';

export class SlotExistError extends BadRequestException {
  constructor(name: string, type: string) {
    super(`Слот с именем ${name} и типом ${type} уже создан`);
  }
}
