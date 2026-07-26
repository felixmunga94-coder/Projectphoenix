import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FollowsService {
  constructor(private readonly prisma: PrismaService) {}

  async followUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot follow yourself.');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: {
        id: targetUserId,
      },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found.');
    }

    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      throw new BadRequestException('You already follow this user.');
    }

    await this.prisma.$transaction([
      this.prisma.follow.create({
        data: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      }),

      this.prisma.user.update({
        where: {
          id: currentUserId,
        },
        data: {
          followingCount: {
            increment: 1,
          },
        },
      }),

      this.prisma.user.update({
        where: {
          id: targetUserId,
        },
        data: {
          followersCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return {
      message: 'User followed successfully.',
    };
  }

  async unfollowUser(currentUserId: string, targetUserId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });

    if (!follow) {
      throw new BadRequestException('You are not following this user.');
    }

    await this.prisma.$transaction([
      this.prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        },
      }),

      this.prisma.user.update({
        where: {
          id: currentUserId,
        },
        data: {
          followingCount: {
            decrement: 1,
          },
        },
      }),

      this.prisma.user.update({
        where: {
          id: targetUserId,
        },
        data: {
          followersCount: {
            decrement: 1,
          },
        },
      }),
    ]);

    return {
      message: 'User unfollowed successfully.',
    };
  }

  async getFollowers(userId: string) {
    return this.prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: {
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
  }

  async getFollowing(userId: string) {
    return this.prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: {
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
  }
}