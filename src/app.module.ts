import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { validationSchema } from './utils/config/validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '/etc/automater/production.env',
        './config/production.env',
        './config/development.env',
      ],
      validationSchema: validationSchema,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
