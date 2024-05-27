import { Controller, Get, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { DashBoardService } from './dashboard.service';
import { AuthRequest } from 'src/auth/models/AuthRequest';

@Controller('dashBoard/')
export class DashBoardController {
  constructor(private readonly dashBoardService: DashBoardService) { }

  @Get('reservesOfDay/:date')
  @HttpCode(HttpStatus.OK)
  getReservesOfDay(@Request() request : AuthRequest) {
    return this.dashBoardService.getReservesOfDay(request.user, request.params.date)
  }
}