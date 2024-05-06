import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { CourtService } from './court.service';
import { CreateCourtBody } from 'src/court/dtos/create-court-body';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { CreateOperatingDayBody } from './dtos/create-operatingDay-body';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { ReserveTimeBody } from './dtos/reserve-time-body';
import { CancelReservationBody, CloseDayBody, CloseTimeBody } from './dtos/close-body';

@Controller('court')
export class CourtController {
  constructor(private readonly courtService: CourtService) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  create(@Body() createCourtDto: CreateCourtBody, @Request() request : AuthRequest) {
    return this.courtService.create(createCourtDto, request.user);
  }

  @Get('getUserCourts')
  @HttpCode(HttpStatus.OK)
  getUserCourts(@Request() request : AuthRequest) {
    if (request.user.court.length != 0){
      return this.courtService.getUserCourts(request.user)
    }
  }

  @IsPublic()
  @Get('getCourtInfo/:id/:date')
  @HttpCode(HttpStatus.OK)
  getCourtInfo(@Request() request : AuthRequest) {
    return this.courtService.getCourtInfo(request.params.id, request.params.date)
  }

  @Post('createOperatingDays')
  @HttpCode(HttpStatus.OK)
  createOperatingDays(@Body() createOperatingDayBody : CreateOperatingDayBody,@Request() request : AuthRequest) {
    if (request.user.court.length != 0){
      return this.courtService.createOperatingDays(createOperatingDayBody)
    }
  }

  @Post('reserveTime')
  @HttpCode(HttpStatus.OK)
  reserveTime(@Body() reserveTimeBody : ReserveTimeBody, @Request() request : AuthRequest){
    return this.courtService.reserveTime(reserveTimeBody, request.user)
  }

  @IsPublic()
  @Get('getCourts/:id')
  @HttpCode(HttpStatus.OK)
  getCourts(@Request() request : AuthRequest) {
    return this.courtService.getCourts(request.params.id)
  }

  @Get('getReservedTimes')
  @HttpCode(HttpStatus.OK)
  getReservedTimes(@Request() request : AuthRequest) {
    return this.courtService.getReservedTimes(request.user)
  }

  @IsPublic()
  @Post('closeTime')
  @HttpCode(HttpStatus.OK)
  closeTime(@Body() closeTimeBody : CloseTimeBody){
    return this.courtService.closeTime(closeTimeBody)
  }
  
  @IsPublic()
  @Post('releaseTime')
  @HttpCode(HttpStatus.OK)
  releaseTime(@Body() releaseTimeBody : ReserveTimeBody) {
    return this.courtService.releaseTime(releaseTimeBody)
  }

  @IsPublic()
  @Post('closeDay')
  @HttpCode(HttpStatus.OK)
  closeDay(@Body() closeDayBody : CloseDayBody) {
    return this.courtService.closeDay(closeDayBody)
  }

  @Get('getUserReservations')
  @HttpCode(HttpStatus.OK)
  getUserReservations(@Request() request : AuthRequest){
    return this.courtService.getUserReservations(request.user)
  }

  @Post('cancelReservation')
  @HttpCode(HttpStatus.OK)
  cancelReservation(@Body() cancelReservationBody : CancelReservationBody){
    return this.courtService.cancelReservation(cancelReservationBody)
  }
}