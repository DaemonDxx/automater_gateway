import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export type UserWithoutPassword = Omit<UserEntity, 'password'>;

export class UserEntity implements User {
  id: number;
  email: string;
  login: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
