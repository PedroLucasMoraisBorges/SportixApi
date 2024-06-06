import { Module } from '@nestjs/common';
import { PrismaModule } from "src/database/prisma.module";
import { MailModule } from 'src/mail/mail.module';
import { DashBoardController } from './dashboard.controller';
import { DashBoardService } from './dashboard.service';

@Module({
  imports : [PrismaModule, MailModule],
  controllers: [DashBoardController],
  providers: [DashBoardService],
  exports: [DashBoardService],
})
export class DashBoardModule {}
