export class SaveFileError extends Error {
  constructor(id: number, message: string) {
    super(`Save file ${id} error: ${message}`);
  }
}
