import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService, Jwt } from './auth.service';
import { Request } from 'express';
import { UserWithoutPassword } from '../user/entity/user.entity';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Public } from './decorators/public.decorator';
import { ExtractToken } from './decorators/extract-token.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request): Promise<Jwt> {
    return this.authService.login(req.user as UserWithoutPassword);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@ExtractToken() token: string) {
    return this.authService.logout(token);
  }
}
