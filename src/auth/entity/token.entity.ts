import { Token, TokenStatus } from '@prisma/client';

export class TokenEntity implements Token {
  id: number;
  token: string;
  status: TokenStatus;
  create_at: Date;
  user_id: number;

  constructor(data: Partial<TokenEntity>) {
    Object.assign(this, data);
  }
}
