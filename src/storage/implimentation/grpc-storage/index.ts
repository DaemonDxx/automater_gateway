/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'Storage';

export interface Empty {
}

export interface Metadata {
  id: number;
  filename: string;
  extension: string;
}

export interface File {
  data: Uint8Array;
}

export interface UploadRequest {
  meta?: Metadata | undefined;
  chunk?: File | undefined;
}

export interface UploadResponse {
  hash: string;
  size: number;
}

export interface DownloadRequest {
  id: number;
}

export interface DownloadResponse {
  chunk: File | undefined;
}

export interface DeleteRequest {
  id: number;
}

export const STORAGE_PACKAGE_NAME = 'Storage';

export interface StorageServiceClient {
  upload(request: Observable<UploadRequest>): Observable<UploadResponse>;

  download(request: DownloadRequest): Observable<DownloadResponse>;

  delete(request: DeleteRequest): Observable<Empty>;
}

export interface StorageServiceController {
  upload(request: Observable<UploadRequest>): Promise<UploadResponse> | Observable<UploadResponse> | UploadResponse;

  download(request: DownloadRequest): Observable<DownloadResponse>;

  delete(request: DeleteRequest): Promise<Empty> | Observable<Empty> | Empty;
}

export function StorageServiceControllerMethods() {
  return function(constructor: Function) {
    const grpcMethods: string[] = ['download', 'delete'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('StorageService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = ['upload'];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('StorageService', method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const STORAGE_SERVICE_NAME = 'StorageService';
