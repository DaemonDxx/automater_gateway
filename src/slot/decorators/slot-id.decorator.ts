import {
  createParamDecorator,
  ExecutionContext,
  ParseIntPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { SlotIdMissedError } from '../errors/slot-id-missed.error';
import { SLOT_ID_PARAM_ROUTE } from '../index';

const ExtractSlotID = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    const report_id = req.params[SLOT_ID_PARAM_ROUTE];
    if (!report_id) throw new SlotIdMissedError();
    return report_id;
  },
);

export const SlotID = () => ExtractSlotID(ParseIntPipe);
