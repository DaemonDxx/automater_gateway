import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from './utils/config/validation.schema';
import { WinstonModule } from 'nest-winston';
import { getTransports } from './utils/logger/transports';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD, RouterModule } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { DEVELOPMENT_CONFIG_PATH, PRODUCTION_CONFIG_PATH } from './index';
import { ReportModule } from './report/report.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { SlotModule } from './slot/slot.module';
import { DatabaseErrorFilter } from './database/filters/database-error.filter';
import { OwnerCheckerModule } from './owner-checker/owner-checker.module';
import { appRoutes } from './app.routes';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [PRODUCTION_CONFIG_PATH, DEVELOPMENT_CONFIG_PATH],
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
    DatabaseModule,
    UserModule,
    ReportModule,
    AuthModule,
    SlotModule,
    OwnerCheckerModule,
    RouterModule.register(appRoutes),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: DatabaseErrorFilter,
    },
  ],
})
export class AppModule {}
