import { Observable } from 'rxjs';
import { Readable } from 'stream';
import { CancelError } from '../errors/cancel.error';

export const fromReadableStream = <T>(stream: Readable): Observable<T> =>
  new Observable<T>((subscriber) => {
    const onDataHandler = (chunk) => subscriber.next(chunk);
    const onErrorHandler = (err) => subscriber.error(err);
    const onCompleteHandler = () => subscriber.complete();
    stream.on('error', onErrorHandler);
    stream.on('close', onCompleteHandler);
    stream.on('data', onDataHandler);

    return () => {
      subscriber.error(new CancelError());
    };
  });
