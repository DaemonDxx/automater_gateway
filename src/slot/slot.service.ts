import { Inject, Injectable, Logger } from '@nestjs/common';
import { Prisma, Slot, SlotStatus } from '@prisma/client';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from '../database/prisma.service';
import { FileService } from '../file/file.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { SetActiveFileDto } from './dto/set-active-file.dto';
import { SlotEntity } from './entity/slot.entity';
import { SlotExistError } from './errors/slot-exist.error';

@Injectable()
export class SlotService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async createSlot(dto: CreateSlotDto): Promise<SlotEntity> {
    const slot = await this.prisma.slot.findFirst({
      where: dto,
    });
    if (slot) throw new SlotExistError(dto.name, dto.type);

    const { report_id, ...data } = dto;
    return new SlotEntity(
      await this.prisma.slot.create({
        data: {
          ...data,
          report: {
            connect: {
              id: report_id,
            },
          },
        },
      }),
    );
  }

  async setActiveFile(
    id: number,
    { active_file_id }: SetActiveFileDto,
  ): Promise<void> {
    await this.prisma.slot.update({
      where: {
        id,
      },
      data: {
        active_file: {
          connect: {
            id: active_file_id,
          },
        },
      },
    });
  }

  async getSlogByID(id: number): Promise<SlotEntity> {
    return new SlotEntity(
      await this.prisma.slot.findUnique({
        where: {
          id,
        },
        include: {
          report: true,
          files: true,
          active_file: true,
        },
      }),
    );
  }

  async slotChangeStatus(id: number, status: SlotStatus): Promise<SlotEntity> {
    return new SlotEntity(
      await this.prisma.slot.update({
        where: {
          id,
        },
        data: {
          status,
        },
      }),
    );
  }

  async findSlot(query: Prisma.SlotWhereInput): Promise<Slot[]> {
    return this.prisma.slot.findMany({
      where: query,
    });
  }

  async deleteSlot(id: number): Promise<SlotEntity> {
    const slot = await this.slotChangeStatus(id, SlotStatus.DELETED);
    await this.fileService.deleteFileBySlot(id);
    return slot;
  }
}
