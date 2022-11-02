import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserExistError } from './errors/user-exist.error';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    if (await this.isUserExist(dto)) {
      throw new UserExistError();
    }
    const user = await this.prisma.user.create({
      data: dto,
    });
    return new UserEntity(user);
  }

  async isUserExist(dto: CreateUserDto): Promise<boolean> {
    const user = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            email: dto.email,
          },
          {
            login: dto.login,
          },
        ],
      },
    });
    return user.length !== 0;
  }

  async findByLogin(login: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        login,
      },
    });
    return new UserEntity(user);
  }
}
