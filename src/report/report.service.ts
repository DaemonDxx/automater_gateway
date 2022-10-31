import { Inject, Injectable, Logger } from '@nestjs/common';
import { Report, ReportStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportEntity } from './entity/report.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DatabaseError } from '../database/errors/database.error';
import { ReportQueryParams } from './dto/find-report.dto';
import { ReportNotFoundError } from './errors/report-not-found.error';

@Injectable()
export class ReportService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) {}

  async createReport(
    owner: number,
    dto: CreateReportDto,
  ): Promise<ReportEntity> {
    try {
      return new ReportEntity(
        await this.prisma.report.create({
          data: {
            ...dto,
            owner: {
              connect: {
                id: owner,
              },
            },
          },
        }),
      );
    } catch (e) {
      this.logger.error(
        `Cannot create new report with params ${dto}: ${e.message}`,
      );
      throw new DatabaseError(e.message);
    }
  }

  async getReportByID(id: number): Promise<ReportEntity> {
    try {
      return new ReportEntity(
        await this.prisma.report.findUnique({
          where: {
            id,
          },
        }),
      );
    } catch (e) {
      this.logger.error(
        `Cannot find report by id ${id}: ${e.message}`,
        e.stack,
      );
      throw new DatabaseError(e.message);
    }
  }

  async find(params: ReportQueryParams): Promise<ReportEntity[]> {
    try {
      const toEntity = (report: Report): ReportEntity =>
        new ReportEntity(report);
      const result = await this.prisma.report.findMany(params);
      return result.map(toEntity);
    } catch (e) {
      this.logger.error(
        `Cannot find report with params ${params}: ${e.message}`,
      );
      throw new DatabaseError(e.message);
    }
  }

  async deleteReportByID(id: number): Promise<ReportEntity> {
    try {
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
    } catch (e) {
      if (e.code === 'P2025') throw new ReportNotFoundError(id);
      this.logger.error(
        `Cannot delete report ${id}: ${e.message}`,
        ReportService.name,
      );
      throw new DatabaseError(e.message);
    }
  }
}
