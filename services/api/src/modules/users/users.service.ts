import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        bio: true,
        avatar: true,
        coverPhoto: true,
        followersCount: true,
        followingCount: true,
        verified: true,
        coins: true,
        diamonds: true,
        walletBalance: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async create(data: {
    username: string;
    email: string;
    password: string;
  }) {
    return this.prisma.user.create({
      data,
    });
  }
}