import { map, Observable, startWith } from 'rxjs';
import { Readable } from 'stream';
import { FileMeta } from '../../../storage.interface';
import { UploadRequest } from '../index';
import { fromReadableStream } from './from-readable-stream.observable';

export const CreateUploadORequest = (
  id: number,
  stream: Readable,
  { filename, extension }: FileMeta,
): Observable<UploadRequest> =>
  fromReadableStream(stream).pipe(
    map<any, UploadRequest>((data) => ({
      chunk: {
        data,
      },
    })),
    startWith<UploadRequest>({
      meta: {
        id,
        filename,
        extension,
      },
    }),
  );
