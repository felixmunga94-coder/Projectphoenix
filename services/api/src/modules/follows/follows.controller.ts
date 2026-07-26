import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FollowsService } from './follows.service';

@Controller('users')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  follow(
    @Request() req,
    @Param('id') targetUserId: string,
  ) {
    return this.followsService.followUser(
      req.user.id,
      targetUserId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/follow')
  unfollow(
    @Request() req,
    @Param('id') targetUserId: string,
  ) {
    return this.followsService.unfollowUser(
      req.user.id,
      targetUserId,
    );
  }

  @Get(':id/followers')
  followers(@Param('id') userId: string) {
    return this.followsService.getFollowers(userId);
  }

  @Get(':id/following')
  following(@Param('id') userId: string) {
    return this.followsService.getFollowing(userId);
  }
}