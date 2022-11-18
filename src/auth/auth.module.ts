import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { TokenService } from './token.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get('jwt_secret_key'),
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
  ],
  controllers: [AuthController],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
