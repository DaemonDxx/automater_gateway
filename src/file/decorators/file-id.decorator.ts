import {
  createParamDecorator,
  ExecutionContext,
  ParseIntPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { FileIdMissedError } from '../errors/file-id-missed.error';
import { FILE_ID_PARAM_ROUTE } from '../index';

const ExtractFileID = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    const report_id = req.params[FILE_ID_PARAM_ROUTE];
    if (!report_id) throw new FileIdMissedError();
    return report_id;
  },
);

export const FileID = () => ExtractFileID(ParseIntPipe);
