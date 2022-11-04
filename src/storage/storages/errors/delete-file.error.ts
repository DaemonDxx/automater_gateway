export class DeleteFileError extends Error {
  constructor(id: number, message: string) {
    super(`Delete file ${id} error: ${message}`);
  }
}
