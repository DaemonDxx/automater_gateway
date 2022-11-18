import { Readable } from 'stream';

export type FileMeta = {
  filename: string;
  extension: string;
};

export type StorageSaveResult = {
  hash: string;
  size: number;
};

export interface StorageService {
  save(
    id: number,
    stream: Readable,
    meta: FileMeta,
  ): StorageSaveResult | Promise<StorageSaveResult>;

  delete(id: number): void | Promise<void>;
}
