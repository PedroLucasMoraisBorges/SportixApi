<<<<<<< Updated upstream
import { Body, Controller, Get, Post } from '@nestjs/common';
=======
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
>>>>>>> Stashed changes
import { UserService } from './user.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { CreateUserBody } from 'src/user/dtos/create-user-body';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { EditUserBody } from './dtos/edit-user-body';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

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
<<<<<<< Updated upstream
=======

  @Get('getUserInfo')
  @HttpCode(HttpStatus.OK)
  getUserInfo(@Request() request: AuthRequest) {
    return this.userService.getUserInfo(request.user)
  }

  @Post('editUser')
  @HttpCode(HttpStatus.OK)
  editUser(@Body() editUserBody: EditUserBody, @Request() request: AuthRequest) {
    return this.userService.editUser(editUserBody, request.user)
  }
>>>>>>> Stashed changes
}