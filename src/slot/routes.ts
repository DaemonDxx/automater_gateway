import { RouteTree } from '@nestjs/core';
import { SlotModule } from './slot.module';
import { childRouteWithParam } from '../utils/routes/child-route-with-param';
import { fileRoute } from '../file/routes';
import { SLOT_ID_PARAM_ROUTE, SLOT_ROUTE } from './index';

export const slotRoute: RouteTree = {
  path: SLOT_ROUTE,
  module: SlotModule,
  children: [childRouteWithParam(fileRoute, SLOT_ID_PARAM_ROUTE)],
};
