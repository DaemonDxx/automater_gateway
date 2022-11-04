import { Readable } from 'stream';

export type StorageSaveResult = {
  hash: string;
  size: number;
};

export interface StorageService {
  save(
    id: number,
    stream: Readable,
  ): StorageSaveResult | Promise<StorageSaveResult>;

  delete(id: number): void | Promise<void>;
}
