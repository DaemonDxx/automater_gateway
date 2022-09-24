import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const extractTokenFromCtx = (context: ExecutionContext): string => {
  const reg: Request = context.switchToHttp().getRequest();
  const res = reg.headers.authorization.split(' ');
  return res[1];
};
