import { Inject, Injectable, Logger } from '@nestjs/common';
import { Report, ReportStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportEntity } from './entity/report.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ReportQueryParams } from './dto/find-report.dto';
import { ReportNotFoundError } from './errors/report-not-found.error';

@Injectable()
export class ReportService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) {}

  async createReport({
    owner_id,
    ...data
  }: CreateReportDto): Promise<ReportEntity> {
    return new ReportEntity(
      await this.prisma.report.create({
        data: {
          ...data,
          owner: {
            connect: {
              id: owner_id,
            },
          },
        },
      }),
    );
  }

  async getReportByID(id: number): Promise<ReportEntity> {
    return new ReportEntity(
      await this.prisma.report.findUnique({
        where: {
          id,
        },
        include: {
          slots: true,
        },
      }),
    );
  }

  async find(params: ReportQueryParams): Promise<ReportEntity[]> {
    const toEntity = (report: Report): ReportEntity => new ReportEntity(report);
    const result = await this.prisma.report.findMany(params);
    return result.map(toEntity);
  }

  async deleteReportByID(id: number): Promise<ReportEntity> {
    return new ReportEntity(
      await this.prisma.report.update({
        where: {
          id,
        },
        data: {
          status: ReportStatus.DELETED,
        },
      }),
    );
  }
}
