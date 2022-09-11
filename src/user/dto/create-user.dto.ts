import { User } from '@prisma/client';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto implements Omit<User, 'id'> {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  login: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(64)
  email: string;
}
