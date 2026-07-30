import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  async getFeed(userId: string) {
    const following = await this.prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = following.map((user) => user.followingId);

    return this.prisma.post.findMany({
      where: {
        authorId: {
          in: followingIds,
        },
      },
      include: {
        author: {
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
}