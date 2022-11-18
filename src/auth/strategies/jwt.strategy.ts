import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserWithoutPassword } from '../../user/entity/user.entity';
import { JwtPayload } from '../token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('jwt_secret_key'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserWithoutPassword> {
    return {
      ...payload.user,
    };
  }
}
