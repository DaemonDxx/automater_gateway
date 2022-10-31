import { Report } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class CreateReportDto implements Pick<Report, 'title'> {
  @IsOptional()
  title: string;
}
