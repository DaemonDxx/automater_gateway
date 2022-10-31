import { Report, ReportStatus } from '@prisma/client';

export class ReportEntity implements Report {
  constructor(report: Report) {
    Object.assign(this, report);
  }

  status: ReportStatus;
  id: number;
  title: string;
  create_at: Date;
  update_at: Date;
  owner_id: number;
}
