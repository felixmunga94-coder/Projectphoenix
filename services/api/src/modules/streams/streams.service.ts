import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { StreamStatus } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';

@Injectable()
export class StreamsService {
  constructor(private prisma: PrismaService) {}

  private async getOwnedStream(
    userId: string,
    streamId: string,
  ) {
    const stream = await this.prisma.stream.findUnique({
      where: {
        id: streamId,
      },
    });

    if (!stream) {
      throw new NotFoundException('Stream not found');
    }

    if (stream.hostId !== userId) {
      throw new ForbiddenException(
        'You do not own this stream',
      );
    }

    return stream;
  }

  async create(
    userId: string,
    dto: CreateStreamDto,
  ) {
    return this.prisma.stream.create({
      data: {
        ...dto,
        hostId: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.stream.findMany({
      include: {
        host: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            verified: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const stream = await this.prisma.stream.findUnique({
      where: {
        id,
      },
      include: {
        host: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            verified: true,
          },
        },
      },
    });

    if (!stream) {
      throw new NotFoundException('Stream not found');
    }

    return stream;
  }

  async update(
    userId: string,
    streamId: string,
    dto: UpdateStreamDto,
  ) {
    await this.getOwnedStream(userId, streamId);

    return this.prisma.stream.update({
      where: {
        id: streamId,
      },
      data: dto,
    });
  }

  async remove(
    userId: string,
    streamId: string,
  ) {
    await this.getOwnedStream(userId, streamId);

    await this.prisma.stream.delete({
      where: {
        id: streamId,
      },
    });

    return {
      success: true,
      message: 'Stream deleted successfully',
    };
  }

  async goLive(
    userId: string,
    streamId: string,
  ) {
    const stream = await this.getOwnedStream(
      userId,
      streamId,
    );

    if (stream.status === StreamStatus.LIVE) {
      throw new BadRequestException(
        'Stream is already live',
      );
    }

    if (stream.status === StreamStatus.ENDED) {
      throw new BadRequestException(
        'Ended streams cannot go live again',
      );
    }

    return this.prisma.stream.update({
      where: {
        id: streamId,
      },
      data: {
        status: StreamStatus.LIVE,
      },
    });
  }

  async endStream(
    userId: string,
    streamId: string,
  ) {
    const stream = await this.getOwnedStream(
      userId,
      streamId,
    );

    if (stream.status === StreamStatus.ENDED) {
      throw new BadRequestException(
        'Stream has already ended',
      );
    }

    return this.prisma.stream.update({
      where: {
        id: streamId,
      },
      data: {
        status: StreamStatus.ENDED,
      },
    });
  }
}