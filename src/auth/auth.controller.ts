import { Controller, HttpCode, HttpStatus, Post, UseGuards, Request} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { AuthRequest } from './models/authRequest';
import { IsPublic } from './decorators/is-public.decorator';

@Controller()
export class AuthController {
    constructor(private readonly authService : AuthService) { }

    @IsPublic()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    login(@Request() request : AuthRequest) {
        return this.authService.login(request.user)
    }
}