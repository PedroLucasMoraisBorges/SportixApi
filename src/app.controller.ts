import { Controller, Get, UseGuards } from '@nestjs/common';
// import { IsPublic } from './auth/decorators/is-public.decorator';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller()
export class AppController {

  @Get()
  @UseGuards(JwtAuthGuard)
  getHello(): string {
    return "Hello World!";
  }

  @Get('me')
  getMe(@CurrentUser() user : User) {
    return user;
  }
}
