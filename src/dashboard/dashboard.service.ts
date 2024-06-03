import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DashBoardService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  private getMonthNames() {
    return [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ];
  }

  private async getMonths() {
    return {
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
  }

  private async getUserCourts(user) {
    return await this.prisma.court.findMany({
      where: {
        fk_user: user.id,
      },
      include: {
        Reservation: true,
      },
    });
  }

  async getReservesOfDay(user, date: string): Promise<number> {
    const courts = await this.getUserCourts(user)
  
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

  async getReservesPerMonth(user, year: string) {
    const courts = await this.getUserCourts(user)
    const reservationsPerMonth = await this.getMonths()
    const monthNames = this.getMonthNames()
  
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

  async getReservesPerDay(user) {
    const today = new Date();
    const dayOfWeek = today.getDay();
  
    // Início da semana (domingo)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
  
    const weekDates: { [key: string]: number } = {};
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
  
      const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}-${currentDate.getFullYear()}`;
  
      const reserves = await this.prisma.reservation.findMany({
        where: {
          date: formattedDate,
          status: "Agendado"
        }
      });
  
      let count = 0;
      for (const reserve of reserves) {
        const court = await this.prisma.court.findUnique({
          where: {
            id: reserve.fk_court
          }
        });
  
        if (court && court.fk_user === user.id) {
          count++;
        }
      }
      weekDates[dayNames[i]] = count;
    }
  
    return weekDates;
  }
  
  async get_C_ReservesPerMonth(user, year: string): Promise<{ [key: string]: number }> {
    const courts = await this.getUserCourts(user)
    const  monthsOfYear = await this.getMonths()
    const monthNames = await this.getMonthNames()
  
    for (const court of courts) {
      for (const reservation of court.Reservation) {
        const reservationDate = new Date(reservation.date);
        const reservationYear = reservationDate.getFullYear();
  
        if (reservationYear === Number(year) && reservation.status === "Cancelado") {
          const monthIndex = reservationDate.getMonth(); // Obtém o mês (0 - Janeiro, 11 - Dezembro)
          const monthName = monthNames[monthIndex];
          monthsOfYear[monthName]++;
        }
      }
    }
  
    return monthsOfYear;
  }
}