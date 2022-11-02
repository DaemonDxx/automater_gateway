import {
  createParamDecorator,
  ExecutionContext,
  ParseIntPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { REPORT_ID_PARAM_ROUTE } from '../index';
import { ReportIdMissedError } from '../errors/report-id-missed.error';

const ExtractReportID = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    const report_id = req.params[REPORT_ID_PARAM_ROUTE];
    if (!report_id) throw new ReportIdMissedError();
    return report_id;
  },
);

export const ReportID = () => ExtractReportID(ParseIntPipe);
