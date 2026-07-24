import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(body: any) {
    const existingUser = await this.usersService.findByEmail(body.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await this.usersService.create({
  username: body.username,
  email: body.email,
  password: hashedPassword,
});

    const { password, ...safeUser } = user;

    return {
      success: true,
      message: 'User registered successfully',
      user: safeUser,
    };
  }

  async login(body: any) {
    const user = await this.usersService.findByEmail(body.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      body.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password, ...safeUser } = user;

    const token = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        secret: process.env.JWT_SECRET!,
      },
    );

    return {
      success: true,
      message: 'Login successful',
      token,
      user: safeUser,
    };
  }
}