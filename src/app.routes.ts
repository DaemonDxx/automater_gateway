import { Routes } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { reportRoute } from './report/routes';

export const USER_ROUTE = 'user';
export const AUTH_ROUTE = 'auth';

export const appRoutes: Routes = [
  reportRoute,
  {
    path: USER_ROUTE,
    module: UserModule,
  },
  {
    path: AUTH_ROUTE,
    module: AuthModule,
  },
];
