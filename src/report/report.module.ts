import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { OwnerCheckerModule } from '../owner-checker/owner-checker.module';

@Module({
  imports: [OwnerCheckerModule],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
