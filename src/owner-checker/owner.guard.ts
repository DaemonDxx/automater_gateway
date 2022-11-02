import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OwnerCheckerService } from './owner-checker.service';
import { Request } from 'express';
import { UserWithoutPassword } from '../user/entity/user.entity';
import { REPORT_ID_PARAM_ROUTE } from '../report';
import { SLOT_ID_PARAM_ROUTE } from '../slot';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly ownerCheckerService: OwnerCheckerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const user = req.user as UserWithoutPassword;
    if (!user) throw new UnauthorizedException();
    let isOwner = null;
    for (const [key, value] of Object.entries(req.params)) {
      if (!value || !OwnerGuard.isNumber(value)) continue;
      const parsedValue = parseInt(value);
      switch (key) {
        case REPORT_ID_PARAM_ROUTE:
          isOwner = await this.ownerCheckerService.userIsOwnerReport(
            user,
            parsedValue,
          );
          break;
        case SLOT_ID_PARAM_ROUTE:
          isOwner = await this.ownerCheckerService.userIsOwnerSlot(
            user,
            parsedValue,
          );
          break;
      }
      if (!isOwner) throw new ForbiddenException();
    }
    return true;
  }

  static isNumber(value: any): boolean {
    return !isNaN(parseInt(value));
  }
}
