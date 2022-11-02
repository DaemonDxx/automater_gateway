import { RouteTree } from '@nestjs/core';
import { ReportModule } from './report.module';
import { childRouteWithParam } from '../utils/routes/child-route-with-param';
import { slotRoute } from '../slot/routes';
import { REPORT_ID_PARAM_ROUTE, REPORT_ROUTE } from './index';

export const reportRoute: RouteTree = {
  path: REPORT_ROUTE,
  module: ReportModule,
  children: [childRouteWithParam(slotRoute, REPORT_ID_PARAM_ROUTE)],
};
