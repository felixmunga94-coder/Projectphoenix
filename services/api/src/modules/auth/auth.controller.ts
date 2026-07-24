import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
register(@Body() body: RegisterDto) {
  return this.authService.register(body);
}

   @Post('login')
login(@Body() body: LoginDto) {
  return this.authService.login(body);
}

 @Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user: any) {
  return user;
}
}
