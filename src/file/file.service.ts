import { Inject, Injectable, Logger } from '@nestjs/common';
import { FileMeta, FileStatus } from '@prisma/client';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from '../database/prisma.service';
import { FileEntity } from './entity/file.entity';

@Injectable()
export class FileService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) {}

  async createFile(slot_id: number): Promise<FileEntity> {
    return new FileEntity(
      await this.prisma.file.create({
        data: {
          slot: {
            connect: {
              id: slot_id,
            },
          },
        },
      }),
    );
  }

  async getFileByID(id: number) {
    return new FileEntity(
      await this.prisma.file.findUnique({
        where: {
          id,
        },
        include: {
          meta: {
            select: {
              mime: true,
              hash: true,
              size: true,
            },
          },
          slot: true,
        },
      }),
    );
  }

  async changeStatusFile(id: number, status: FileStatus) {
    await this.prisma.file.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: {
        meta: true,
        slot: true,
      },
    });
  }

  async uploadFile(
    file_id: number,
    slot_id: number,
    meta: Pick<FileMeta, 'mime' | 'size' | 'hash'>,
  ): Promise<FileEntity> {
    await this.prisma.file.update({
      where: {
        id: file_id,
      },
      data: {
        meta: {
          create: meta,
        },
      },
    });
    await this.changeStatusFile(file_id, FileStatus.DOWNLOADED);
    return this.getFileByID(file_id);
  }

  async deleteFileBySlot(slot_id: number) {
    await this.prisma.file.updateMany({
      where: {
        slot_id,
      },
      data: {
        status: FileStatus.MARK_DELETE,
      },
    });
  }
}
