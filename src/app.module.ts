import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from './utils/config/validation.schema';
import { WinstonModule } from 'nest-winston';
import { getTransports } from './utils/logger/transports';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt.guard';

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
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
