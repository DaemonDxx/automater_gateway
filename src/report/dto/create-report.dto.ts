import { Report } from '@prisma/client';
import { IsEmpty, IsOptional } from 'class-validator';

export class CreateReportDto implements Pick<Report, 'title' | 'owner_id'> {
  @IsOptional()
  title: string;

  @IsEmpty()
  owner_id: number;
}
