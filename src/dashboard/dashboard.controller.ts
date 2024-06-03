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

  @Get('reservesPerMonth/:year')
  @HttpCode(HttpStatus.OK)
  getReservesPerMonth(@Request() request : AuthRequest) {
    return this.dashBoardService.getReservesPerMonth(request.user, request.params.year)
  }

  @Get('reservesPerDay/')
  @HttpCode(HttpStatus.OK)
  getReservesPerDay(@Request() request : AuthRequest) {
    return this.dashBoardService.getReservesPerDay(request.user)
  }
}