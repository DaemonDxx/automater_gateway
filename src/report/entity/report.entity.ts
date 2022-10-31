import { Report, ReportStatus } from '@prisma/client';

export class ReportEntity implements Report {
  status: ReportStatus;
  id: number;
  title: string;
  create_at: Date;
  update_at: Date;
  owner_id: number;
}
