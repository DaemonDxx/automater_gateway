import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserWithoutPassword } from '../../user/entity/user.entity';

export const ExtractUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserWithoutPassword => {
    const req = ctx.switchToHttp().getRequest<Express.Request>();
    return req.user as UserWithoutPassword;
  },
);
