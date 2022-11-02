import { RouteTree } from '@nestjs/core';

export const childRouteWithParam = (
  childRoute: RouteTree,
  param: string,
): RouteTree => ({
  ...childRoute,
  path: `/:${param}/${childRoute.path}`,
});
