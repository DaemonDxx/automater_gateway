import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, RouterModule } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { appRoutes } from './app.routes';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { DatabaseModule } from './database/database.module';
import { DatabaseErrorFilter } from './database/filters/database-error.filter';
import { FileModule } from './file/file.module';
import { DEVELOPMENT_CONFIG_PATH, PRODUCTION_CONFIG_PATH } from './index';
import { OwnerCheckerModule } from './owner-checker/owner-checker.module';
import { ReportModule } from './report/report.module';
import { SlotModule } from './slot/slot.module';
import { UserModule } from './user/user.module';
import { validationSchema } from './utils/config/validation.schema';
import { getTransports } from './utils/logger/transports';

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
    FileModule,
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
