import { BadRequestException } from '@nestjs/common';

export class UserExistError extends BadRequestException {
  constructor() {
    super('Пользователь с таким логином или почтой уже существует');
  }
}
