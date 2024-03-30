import { Module } from '@nestjs/common';
import { CourtService } from './court.service';
import { CourtController } from './court.controller';

@Module({
  controllers: [CourtController],
  providers: [CourtService],
})
export class CourtModule {}
