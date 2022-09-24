import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserWithoutPassword } from '../../user/entity/user.entity';
import { AuthService } from '../auth.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly authService: AuthService,
  ) {
    super({
      usernameField: 'login',
      passwordField: 'password',
    });
  }

  async validate(
    login: string,
    password: string,
  ): Promise<UserWithoutPassword> {
    const user = await this.authService.validateUser(login, password);
    if (!user) {
      this.logger.warn(`Login failed - ${login}`, LocalStrategy.name);
      throw new UnauthorizedException();
    }
    return user;
  }
}
