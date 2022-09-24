import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { extractTokenFromCtx } from '../utils/extract-token-from-ctx';

export const ExtractToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return extractTokenFromCtx(ctx);
  },
);
