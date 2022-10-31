import { BadRequestException } from '@nestjs/common';

export class ReportNotFoundError extends BadRequestException {
  constructor(id: number) {
    super(`Report с ID ${id} не существует`);
  }
}
