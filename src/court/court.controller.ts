import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Request } from '@nestjs/common';
import { CourtService } from './court.service';
import { CreateCourtBody, EditCourtBody } from 'src/court/dtos/create-court-body';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { CreateOperatingDayBody } from './dtos/create-operatingDay-body';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { ReserveTimeBody } from './dtos/reserve-time-body';
import { CancelReservationBody, CloseDayBody, CloseTimeBody } from './dtos/close-body';
import { SelectRecurrenceRangeBody } from './dtos/recurrence-user-body';
import { ReleaseDayBody, ReleaseTimebody } from './dtos/release-time-body';
import { DeleteCourtBody } from './dtos/delete-court.dto';

@Controller('court')
export class CourtController {
  constructor(private readonly courtService: CourtService) { }

  // Admin
  @Post('create')
  @HttpCode(HttpStatus.OK)
  create(@Body() createCourtDto: CreateCourtBody, @Request() request: AuthRequest) {
    return this.courtService.create(createCourtDto, request.user);
  }

  @Post('createOperatingDays')
  @HttpCode(HttpStatus.OK)
  createOperatingDays(@Body() createOperatingDayBody: CreateOperatingDayBody, @Request() request: AuthRequest) {
    if (request.user.court.length != 0) {
      return this.courtService.createOperatingDays(createOperatingDayBody)
    }
  }

  @Put('edit')
  @HttpCode(HttpStatus.OK)
  editCourt(@Body() editCourtBody : EditCourtBody) {
    return this.courtService.editCourt(editCourtBody)
  }

  @Delete('delete')
  @HttpCode(HttpStatus.OK)
  deleteCourt(@Body() deleteCourtBody : DeleteCourtBody, @Request() request : AuthRequest) {
    if (request.user.court.length > 0) {
      return this.courtService.deleteCourt(deleteCourtBody, request.user)
    }
  }

  @Get('getUserCourts')
  @HttpCode(HttpStatus.OK)
  getUserCourts(@Request() request: AuthRequest) {
    if (request.user.court.length != 0) {
      return this.courtService.getUserCourts(request.user)
    }
  }

  @Get('getUserCourtInfo/:id/:date')
  @HttpCode(HttpStatus.OK)
  getUserCourtInfo(@Request() request: AuthRequest) {
    return this.courtService.getUserCourtInfo(request.params.id, request.params.date)
  }

  @IsPublic()
  @Post('closeTime')
  @HttpCode(HttpStatus.OK)
  closeTime(@Body() closeTimeBody: CloseTimeBody) {
    return this.courtService.closeTime(closeTimeBody)
  }

  @IsPublic()
  @Post('releaseTime')
  @HttpCode(HttpStatus.OK)
  releaseTime(@Body() releaseTimeBody: ReleaseTimebody) {
    return this.courtService.releaseTime(releaseTimeBody)
  }

  @IsPublic()
  @Post('releaseDay')
  @HttpCode(HttpStatus.OK)
  releaseDay(@Body() releaseDayBody: ReleaseDayBody) {
    return this.courtService.releaseDay(releaseDayBody)
  }

  @IsPublic()
  @Post('closeDay')
  @HttpCode(HttpStatus.OK)
  closeDay(@Body() closeDayBody: CloseDayBody) {
    return this.courtService.closeDay(closeDayBody)
  }

  // User

  @IsPublic()
  @Get('getCourtInfo/:id/:date')
  @HttpCode(HttpStatus.OK)
  getCourtInfo(@Request() request: AuthRequest) {
    return this.courtService.getCourtInfo(request.params.id, request.params.date)
  }

  @Post('reserveTime')
  @HttpCode(HttpStatus.OK)
  reserveTime(@Body() reserveTimeBody: ReserveTimeBody, @Request() request: AuthRequest) {
    return this.courtService.reserveTime(reserveTimeBody, request.user)
  }

  @IsPublic()
  @Get('getCourts/:id')
  @HttpCode(HttpStatus.OK)
  getCourts(@Request() request: AuthRequest) {
    return this.courtService.getCourts(request.params.id)
  }

  @Get('getReservedTimes')
  @HttpCode(HttpStatus.OK)
  getReservedTimes(@Request() request: AuthRequest) {
    return this.courtService.getReservedTimes(request.user)
  }

  @Get('getUserReservations')
  @HttpCode(HttpStatus.OK)
  getUserReservations(@Request() request: AuthRequest) {
    return this.courtService.getUserReservations(request.user)
  }

  @Post('cancelReservation')
  @HttpCode(HttpStatus.OK)
  cancelReservation(@Body() cancelReservationBody: CancelReservationBody) {
    return this.courtService.cancelReservation(cancelReservationBody)
  }

  @Post('turnRecurrentUser')
  @HttpCode(HttpStatus.OK)
  turnRecurrentUser(@Body() selectRecurrenceRangeBody: SelectRecurrenceRangeBody, @Request() request: AuthRequest) {
    return this.courtService.turnRecurrentUser(selectRecurrenceRangeBody, request.user)
  }
}