export class TokenNotFindError extends Error {
  constructor(id: string) {
    super(`Токен с id - ${id} не существует`);
  }
}
