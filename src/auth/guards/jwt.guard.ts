import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { TokenService } from '../token.service';
import { extractTokenFromCtx } from '../utils/extract-token-from-ctx';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = extractTokenFromCtx(context);
    if (!token)
      throw new UnauthorizedException('Отсутствует токен в заголовках');

    if (!(await this.tokenService.isTokenActive(token)))
      throw new UnauthorizedException('Токен не активен');

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context) as Promise<boolean>;
  }
}
