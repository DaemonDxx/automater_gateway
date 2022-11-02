import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Response } from 'express';

type DatabaseErrorResponse = {
  statusCode: number;
  message: string;
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class DatabaseErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): any {
    this.logger.error(exception.message, exception.stack, DatabaseErrorFilter);
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse();
    const jsonResponse = DatabaseErrorFilter.getResponseError(exception);
    res.status(jsonResponse.statusCode).json(jsonResponse);
  }

  static getResponseError(
    err: Prisma.PrismaClientKnownRequestError,
  ): DatabaseErrorResponse {
    switch (err.code) {
      case 'P2025':
        return {
          statusCode: 400,
          message: 'Не корректный ID',
        };
      default:
        return {
          statusCode: 500,
          message: 'Internal server error',
        };
    }
  }
}
