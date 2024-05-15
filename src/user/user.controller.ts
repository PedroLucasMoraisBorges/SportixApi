import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { CreateUserBody } from 'src/user/dtos/create-user-body';

@Controller('user')
export class UserController {
  constructor(private userService : UserService){}

  @IsPublic()
  @Post('create')
  create(@Body() createUserDto: CreateUserBody) {
    return this.userService.create(createUserDto);
  }

  @IsPublic()
  @Get()
  async getUserNames(): Promise<string[]> {
    return this.userService.getUserNames(); // Método para obter apenas os nomes dos usuários
  }
}