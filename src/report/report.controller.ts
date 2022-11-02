import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ReportEntity } from './entity/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { ExtractUser } from '../auth/decorators/extract-user.decorator';
import { UserWithoutPassword } from '../user/entity/user.entity';
import { ReportService } from './report.service';
import { OwnerGuard } from '../owner-checker/owner.guard';
import { defaultFindReportDto, FindReportDto } from './dto/find-report.dto';
import { InitPipe } from '../utils/pipes/init.pipe';
import { ReportID } from './decorators/report-id.decorator';
import { REPORT_ID_PARAM_ROUTE } from './index';

@Controller()
@UseGuards(OwnerGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  async getReports(
    @Query(
      new InitPipe(defaultFindReportDto),
      new ValidationPipe({ whitelist: true, transform: true }),
    )
    query: FindReportDto,
    @ExtractUser() user: UserWithoutPassword,
  ): Promise<ReportEntity[]> {
    query.where.owner_id = user.id;
    return this.reportService.find(query);
  }

  @Get(`/:${REPORT_ID_PARAM_ROUTE}`)
  async getReportInfo(@ReportID() id: number): Promise<ReportEntity> {
    return this.reportService.getReportByID(id);
  }

  @Post()
  async createReport(
    @Body() dto: CreateReportDto,
    @ExtractUser() user: UserWithoutPassword,
  ): Promise<ReportEntity> {
    dto.owner_id = user.id;
    return this.reportService.createReport(dto);
  }

  @Delete(`/:${REPORT_ID_PARAM_ROUTE}`)
  async deleteReport(@ReportID() id: number): Promise<ReportEntity> {
    return this.reportService.deleteReportByID(id);
  }
}
