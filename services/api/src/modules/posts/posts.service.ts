import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        ...dto,
        authorId: userId,
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
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
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
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
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
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    return post;
  }

  async update(
    postId: string,
    userId: string,
    dto: UpdatePostDto,
  ) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException(
        'You can only edit your own posts.',
      );
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: dto,
    });
  }

  async remove(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException(
        'You can only delete your own posts.',
      );
    }

    await this.prisma.post.delete({
      where: { id: postId },
    });

    return {
      message: 'Post deleted successfully.',
    };
  }
}