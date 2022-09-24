import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { TokenService } from './token.service';
import { PrismaService } from '../database/prisma.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET_KEY,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy,
    TokenService,
    PrismaService,
  ],
  controllers: [AuthController],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
