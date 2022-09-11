import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  Logger,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly userService: UserService,
  ) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.createUser(dto);
  }
}
