import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UserWithoutPassword } from '../user/entity/user.entity';
import { ReportNotFoundError } from '../report/errors/report-not-found.error';
import { SlotNotFoundError } from '../slot/errors/slot-not-found.error';

@Injectable()
export class OwnerCheckerService {
  constructor(private readonly prisma: PrismaService) {}

  async userIsOwnerReport(
    user: UserWithoutPassword,
    report_id: number,
  ): Promise<boolean> {
    const report = await this.prisma.report.findUnique({
      where: {
        id: report_id,
      },
    });
    if (!report) throw new ReportNotFoundError(report_id);
    return report.owner_id === user.id;
  }

  async userIsOwnerSlot(
    user: UserWithoutPassword,
    slot_id: number,
  ): Promise<boolean> {
    const slot = await this.prisma.slot.findUnique({
      where: {
        id: slot_id,
      },
      include: {
        report: true,
      },
    });
    if (!slot) throw new SlotNotFoundError(slot_id);
    return slot.report.owner_id === user.id;
  }
}
