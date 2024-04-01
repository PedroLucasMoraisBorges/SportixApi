import { Module } from '@nestjs/common';
import { CourtService } from './court.service';
import { CourtController } from './court.controller';
import { PrismaModule } from "src/database/prisma.module";

@Module({
  imports : [PrismaModule],
  controllers: [CourtController],
  providers: [CourtService],
  exports: [CourtService],
})
export class CourtModule {}
