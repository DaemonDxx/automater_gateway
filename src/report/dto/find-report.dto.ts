import { Prisma, ReportStatus } from '@prisma/client';
import { IsOptional, Max, Min } from 'class-validator';
import { DisableGlobalValidationPipe } from '../../utils/decorators/disable-global-validation.decorator';
import { Transform } from 'class-transformer';

export type ReportQueryParams = {
  take?: number;
  skip?: number;
  where?: Prisma.ReportWhereInput;
  orderBy?: Prisma.ReportOrderByWithRelationInput;
};

export const defaultFindReportDto: ReportQueryParams = {
  take: 10,
  skip: 0,
  orderBy: {
    create_at: 'desc',
  },
  where: {
    owner_id: undefined,
    status: {
      not: ReportStatus.DELETED,
    },
  },
};

@DisableGlobalValidationPipe()
export class FindReportDto implements ReportQueryParams {
  @Max(50)
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  take: number;

  @Min(0)
  @Transform(({ value }) => parseInt(value))
  skip: number;

  @IsOptional()
  orderBy: Prisma.ReportOrderByWithRelationInput;

  @IsOptional()
  where: Prisma.ReportWhereInput;
}
