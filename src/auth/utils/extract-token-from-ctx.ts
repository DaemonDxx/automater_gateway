import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const extractTokenFromCtx = (context: ExecutionContext): string => {
  const req: Request = context.switchToHttp().getRequest();
  const authHeader = req.headers.authorization;
  if (!authHeader) return '';
  const res = req.headers.authorization.split(' ');
  return res[1];
};
