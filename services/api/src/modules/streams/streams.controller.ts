import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { StreamsService } from './streams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';

import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('streams')
export class StreamsController {
  constructor(
    private readonly streamsService: StreamsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateStreamDto,
  ) {
    return this.streamsService.create(userId, dto);
  }

  @Get()
  findAll() {
    return this.streamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.streamsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateStreamDto,
  ) {
    return this.streamsService.update(
      userId,
      id,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.streamsService.remove(
      userId,
      id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/live')
  goLive(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.streamsService.goLive(
      userId,
      id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/end')
  endStream(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.streamsService.endStream(
      userId,
      id,
    );
  }
}