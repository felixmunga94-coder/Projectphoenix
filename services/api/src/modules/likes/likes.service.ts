import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async likePost(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      throw new BadRequestException('You already liked this post.');
    }

    await this.prisma.$transaction([
      this.prisma.like.create({
        data: {
          userId,
          postId,
        },
      }),

      this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likesCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return {
      message: 'Post liked successfully.',
    };
  }

  async unlikePost(userId: string, postId: string) {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!existingLike) {
      throw new BadRequestException('You have not liked this post.');
    }

    await this.prisma.$transaction([
      this.prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      }),

      this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
      }),
    ]);

    return {
      message: 'Post unliked successfully.',
    };
  }

  async getLikes(postId: string) {
    return this.prisma.like.findMany({
      where: {
        postId,
      },
      include: {
        user: {
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