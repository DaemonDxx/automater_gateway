import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { GlobalValidationPipe } from './utils/pipes/global-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get<Logger>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  app.useGlobalPipes(
    new GlobalValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors();

  const configService = app.get<ConfigService>(ConfigService);
  await app.listen(configService.get('port'));
}

bootstrap();
