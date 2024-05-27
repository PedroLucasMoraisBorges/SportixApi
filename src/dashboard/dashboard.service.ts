import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DashBoardService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async getReservesOfDay(user, date: string): Promise<number> {
    const courts = await this.prisma.court.findMany({
      where: {
        fk_user: user.id,
      },
      include: {
        Reservation: true,
      },
    });
  
    let totalReservations = 0;
  
    for (const court of courts) {
      for (const reservation of court.Reservation) {
        if (reservation.date === date && reservation.status === "Agendado") {
          totalReservations++;
        }
      }
    }
  
    return totalReservations;
  }
  
}