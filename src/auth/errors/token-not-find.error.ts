import { UnauthorizedException } from '@nestjs/common';

export class TokenNotFindError extends UnauthorizedException {
  constructor(id: string) {
    super(`Токен с id - ${id} не существует`);
  }
}
