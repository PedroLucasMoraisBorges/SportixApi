import { Body, Controller, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { CourtService } from './court.service';
import { CreateCourtBody } from 'src/court/dtos/create-court-body';
import { AuthRequest } from 'src/auth/models/AuthRequest';

@Controller('court')
export class CourtController {
  constructor(private readonly courtService: CourtService) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  create(@Body() createCourtDto: CreateCourtBody, @Request() request : AuthRequest) {
    if (request.user.court.length != 0) {
      return this.courtService.create(createCourtDto, request.user);
    }
  }
}
