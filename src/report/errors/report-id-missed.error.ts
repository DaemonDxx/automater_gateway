import { BadRequestException } from '@nestjs/common';

export class ReportIdMissedError extends BadRequestException {
  constructor() {
    super(`Пропущен параметр ReportID`);
  }
}
