import {
  INestApplication,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {
    super();
  }

  async onModuleInit() {
    this.logger.log('Prisma client start connect...', PrismaService.name);
    try {
      await this.$connect();
      this.logger.log('Prisma client connected', PrismaService.name);
    } catch (e) {
      this.logger.error(
        `Prisma client connection error: ${e.message}`,
        e.stack,
        PrismaService.name,
      );
      throw e;
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
