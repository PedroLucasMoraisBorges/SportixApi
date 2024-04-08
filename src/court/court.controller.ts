import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { CourtService } from './court.service';
import { CreateCourtBody } from 'src/court/dtos/create-court-body';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { CreateOperatingDayBody } from './dtos/create-operatingDay-body';

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

  @Post('createOperatingDays')
  @HttpCode(HttpStatus.OK)
  createOperatingDays(@Body() createOperatingDayBody : CreateOperatingDayBody,@Request() request : AuthRequest) {
    if (request.user.court.length != 0){
      return this.courtService.createOperatingDays(createOperatingDayBody)
    }
  }

  // @Post('createTimes')
  // @HttpCode(HttpStatus.OK)
  // createTime(@Body() createTimeBody : CreateTimeBody, @Request() request : AuthRequest) {
  //   if (request.user.court.length != 0){
  //     return this.courtService.createTimes(createTimeBody)
  //   }
  // }
}
