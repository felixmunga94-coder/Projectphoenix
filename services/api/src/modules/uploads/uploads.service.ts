import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UploadsService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadAvatar(userId: string, file: any) {
    const avatar = `/uploads/avatars/${file.filename}`;

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar,
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

    return {
      success: true,
      message: 'Avatar uploaded successfully',
      user,
    };
  }
}