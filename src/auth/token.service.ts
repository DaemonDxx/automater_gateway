import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from '../database/prisma.service';
import { UserWithoutPassword } from '../user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Token, TokenStatus } from '@prisma/client';
import { TokenEntity } from './entity/token.entity';
import { TokenNotFindError } from './errors/token-not-find.error';

export type JwtPayload = {
  token: Omit<TokenEntity, 'token'>;
  user: UserWithoutPassword;
};

@Injectable()
export class TokenService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async createToken(user: UserWithoutPassword): Promise<Token> {
    let token = await this.prisma.token.create({
      data: {
        token: '',
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    const payload: JwtPayload = {
      user,
      token: token,
    };
    const tokenValue = this.jwtService.sign(payload);
    token = await this.prisma.token.update({
      where: {
        id: token.id,
      },
      data: {
        token: tokenValue,
      },
    });
    return new TokenEntity(token);
  }

  async inactivateToken(token: string) {
    await this.prisma.token.updateMany({
      where: {
        token,
      },
      data: {
        status: TokenStatus.INACTIVE,
      },
    });
  }

  async isTokenActive(token: string): Promise<boolean> {
    const result = await this.prisma.token.findFirst({
      where: {
        token,
      },
    });
    if (!result) throw new TokenNotFindError(token);
    return result.status === TokenStatus.ACTIVE;
  }
}
