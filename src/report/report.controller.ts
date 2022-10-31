import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ReportEntity } from './entity/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { ExtractUser } from '../auth/decorators/extract-user.decorator';
import { UserWithoutPassword } from '../user/entity/user.entity';
import { ReportService } from './report.service';
import { defaultFindReportDto, FindReportDto } from './dto/find-report.dto';
import { InitPipe } from '../utils/pipes/init.pipe';

@Controller('report')
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

  @Get('/:id')
  async getReportInfo(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ReportEntity> {
    return this.reportService.getReportByID(id);
  }

  @Post()
  async createReport(
    @Body() dto: CreateReportDto,
    @ExtractUser() user: UserWithoutPassword,
  ): Promise<ReportEntity> {
    return this.reportService.createReport(user.id, dto);
  }

  @Delete(':id')
  async deleteReport(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ReportEntity> {
    return this.reportService.deleteReportByID(id);
  }
}
