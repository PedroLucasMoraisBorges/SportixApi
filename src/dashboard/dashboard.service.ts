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

  async getReservesPerMonth(user, year: string): Promise<{ [key: string]: number }> {
    const courts = await this.prisma.court.findMany({
      where: {
        fk_user: user.id,
      },
      include: {
        Reservation: true,
      },
    });
  
    // Objeto para armazenar o total de reservas por mês
    const reservationsPerMonth = {
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0
    };
  
    // Mapeamento de índice do mês para o nome do mês
    const monthNames = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ];
  
    for (const court of courts) {
      for (const reservation of court.Reservation) {
        const reservationDate = new Date(reservation.date);
        const reservationYear = reservationDate.getFullYear();
  
        if (reservationYear === Number(year) && reservation.status === "Agendado") {
          const monthIndex = reservationDate.getMonth(); // Obtém o mês (0 - Janeiro, 11 - Dezembro)
          const monthName = monthNames[monthIndex];
          reservationsPerMonth[monthName]++;
        }
      }
    }
  
    return reservationsPerMonth;
  }
  
  
}