import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LikesService } from './likes.service';

@Controller('posts')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  likePost(@Param('id') postId: string, @Request() req) {
    return this.likesService.likePost(req.user.id, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  unlikePost(@Param('id') postId: string, @Request() req) {
    return this.likesService.unlikePost(req.user.id, postId);
  }

  @Get(':id/likes')
  getLikes(@Param('id') postId: string) {
    return this.likesService.getLikes(postId);
  }
}