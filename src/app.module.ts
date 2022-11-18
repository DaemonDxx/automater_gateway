import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, RouterModule } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { join } from 'path';
import { AppController } from './app.controller';
import { appRoutes } from './app.routes';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { DatabaseModule } from './database/database.module';
import { DatabaseErrorFilter } from './database/filters/database-error.filter';
import { FileModule } from './file/file.module';
import { OwnerCheckerModule } from './owner-checker/owner-checker.module';
import { ReportModule } from './report/report.module';
import { SlotModule } from './slot/slot.module';
import { UserModule } from './user/user.module';
import { validationSchema } from './utils/config/validation.schema';
import { YamlConfigLoaderBuilder } from './utils/config/yaml-config-builder';
import { getTransports } from './utils/logger/transports';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        new YamlConfigLoaderBuilder()
          .addPath(join(__dirname, 'config/config.development.yaml'))
          .setValidation(validationSchema)
          .build(),
      ],
    }),
    WinstonModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          transports: getTransports(config.get('env')),
        };
      },
      inject: [ConfigService],
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
