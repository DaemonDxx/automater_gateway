import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UserService } from '../user/user.service';
import { PrismaService } from '../database/prisma.service';
import { UserWithoutPassword } from '../user/entity/user.entity';
import { TokenService } from './token.service';

export type Jwt = {
  access_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) logger: Logger,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(
    login: string,
    password: string,
  ): Promise<UserWithoutPassword> {
    const user = await this.userService.findByLogin(login);
    if (user && user.password === password) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: UserWithoutPassword): Promise<Jwt> {
    const tokenEntity = await this.tokenService.createToken(user);
    return {
      access_token: tokenEntity.token,
    };
  }

  async logout(token: string) {
    return this.tokenService.inactivateToken(token);
  }
}
