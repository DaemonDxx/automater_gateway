import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseError } from '../database/errors/database.error';
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
    try {
      const user = await this.prisma.user.create({
        data: dto,
      });
      return new UserEntity(user);
    } catch (e) {
      this.logger.error(
        `Create user error: ${e.message}`,
        dto,
        UserService.name,
      );
      throw new DatabaseError(e.message);
    }
  }

  async isUserExist(dto: CreateUserDto): Promise<boolean> {
    try {
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
    } catch (e) {
      this.logger.error(`Find user error: ${e.message}`, dto, UserService.name);
      throw new DatabaseError(e.message);
    }
  }
}
