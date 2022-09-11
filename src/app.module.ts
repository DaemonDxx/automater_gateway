import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from './utils/config/validation.schema';
import { WinstonModule } from 'nest-winston';
import { getTransports } from './utils/logger/transports';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '/etc/automater/production.env',
        './config/production.env',
        './config/development.env',
      ],
      validationSchema: validationSchema,
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: () => {
        return {
          transports: getTransports(process.env.NODE_ENV),
        };
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
