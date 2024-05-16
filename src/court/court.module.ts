import { Module } from '@nestjs/common';
import { CourtService } from './court.service';
import { CourtController } from './court.controller';
import { PrismaModule } from "src/database/prisma.module";
import { CourtUtilits } from './utilits/court.utilits';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports : [PrismaModule, MailModule],
  controllers: [CourtController],
  providers: [CourtService, CourtUtilits],
  exports: [CourtService, CourtUtilits],
})
export class CourtModule {}
