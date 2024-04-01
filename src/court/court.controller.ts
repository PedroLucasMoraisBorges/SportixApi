import { Body, Controller, Post } from '@nestjs/common';
import { CourtService } from './court.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { CreateCourtBody } from 'src/court/dtos/create-court-body';

@Controller('court')
export class CourtController {
  constructor(private readonly courtService: CourtService) {}

  @IsPublic()
  @Post('create')
  create(@Body() createCourtDto: CreateCourtBody) {
    return this.courtService.create(createCourtDto);
  }
}
