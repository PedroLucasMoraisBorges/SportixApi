import { Controller, Get, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { DashBoardService } from './dashboard.service';
import { AuthRequest } from 'src/auth/models/AuthRequest';

@Controller('dashBoard/')
export class DashBoardController {
  constructor(private readonly dashBoardService: DashBoardService) { }

  @Get('reservesOfDay/')
  @HttpCode(HttpStatus.OK)
  getReservesOfDay(@Request() request : AuthRequest) {
    return this.dashBoardService.getReservesOfDay(request.user)
  }

  @Get('reservesOfMonth/')
  @HttpCode(HttpStatus.OK)
  getReservesOfMonth(@Request() request : AuthRequest) {
    return this.dashBoardService.getReservesOfMonth(request.user)
  }

  @Get('revenueOfMonth/')
  @HttpCode(HttpStatus.OK)
  getTotalRevenueOfMonth(@Request() request : AuthRequest) {
    return this.dashBoardService.getTotalRevenueOfMonth(request.user)
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

  @Get('reservesCanceledPerMonth/:year')
  @HttpCode(HttpStatus.OK)
  getCanceledReservesPerMonth(@Request() request : AuthRequest) {
    return this.dashBoardService.get_C_ReservesPerMonth(request.user, request.params.year)
  }
}