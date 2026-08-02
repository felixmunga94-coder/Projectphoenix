import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StreamsModule } from './modules/streams/streams.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { FollowsModule } from './modules/follows/follows.module';
import { PostsModule } from './modules/posts/posts.module';
import { FeedModule } from './modules/feed/feed.module';
import { LikesModule } from './modules/likes/likes.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    AuthModule,
    UsersModule,
    StreamsModule,
    UploadsModule,
    FollowsModule,
    PostsModule,
    FeedModule,
    LikesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}