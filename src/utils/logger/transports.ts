import * as winston from 'winston';
import { utilities } from 'nest-winston';

export function getTransports(env: string): winston.transport[] {
  const transports: winston.transport[] = [];
  const level = env === 'production' ? 'info' : 'debug';
  transports.push(
    new winston.transports.Console({
      level,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        utilities.format.nestLike('automater'),
      ),
    }),
  );

  transports.push(
    new winston.transports.File({
      level,
      filename:
        env === 'production' ? '/etc/automater/app.log' : './logs/dev.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        utilities.format.nestLike('automater'),
      ),
    }),
  );
  return transports;
}
