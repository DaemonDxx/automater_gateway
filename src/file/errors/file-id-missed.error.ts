import { BadRequestException } from '@nestjs/common';

export class FileIdMissedError extends BadRequestException {
  constructor() {
    super(`Пропущен параметр FileID`);
  }
}
