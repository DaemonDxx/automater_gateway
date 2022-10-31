import { PrismaClient } from '@prisma/client';
import { catchError, Observable, retry } from 'rxjs';
import { LoggerService } from '@nestjs/common';

export class ConnectionManager {
  private readonly connectObservable: Observable<null | undefined>;
  private isConnected = false;

  constructor(
    private readonly client: PrismaClient,
    private readonly logger?: LoggerService,
  ) {
    this.connectObservable = new Observable<null | undefined>((subscriber) => {
      client
        .$connect()
        .then(() => {
          this.isConnected = true;
          subscriber.complete();
        })
        .catch((e) => subscriber.error(e));
    });
  }

  connect(tryCount = 1, tryDelay = 1000): Promise<null | undefined> {
    if (this.isConnected) return;
    return this.connectObservable
      .pipe(
        catchError((e) => {
          if (this.logger)
            this.logger.warn(
              `Connection try is failed: ${e.message}`,
              ConnectionManager.name,
            );
          throw e;
        }),
        retry({
          delay: tryDelay,
          count: tryCount,
        }),
      )
      .toPromise();
  }
}
