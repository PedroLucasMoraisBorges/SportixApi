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

  async getReservesOfDay(user) {
    const today = new Date();
    const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;

    const lastDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate() - 1).padStart(2, '0')}-${today.getFullYear()};`


    const completeData = {
      'ammount': 0,
      'comparative': 0,
      'situation': '',
      'percentageColorClass': ''
    }

    const courts = await this.getUserCourts(user)

    let totalReservationsToday = 0;
    let totalReservationsYesterday = 0

    for (const court of courts) {
      for (const reservation of court.Reservation) {
        if (reservation.date === formattedDate && reservation.status === "Agendado") {
          totalReservationsToday++;
        }
        if (reservation.date === lastDay && reservation.status === "Agendado") {
          totalReservationsYesterday++;
        }
      }
    }

    completeData.ammount = totalReservationsToday;

    if (totalReservationsYesterday > 0) {
      const percentageChange = ((totalReservationsToday - totalReservationsYesterday) / totalReservationsYesterday) * 100;
      completeData.comparative = Math.round(percentageChange * 10) / 10; // Arredonda para uma casa decimal

      if (percentageChange > 0) {
        completeData.situation = 'maior';
        completeData.percentageColorClass = 'text-emerald-500 dark:text-emerald-400'
      } else if (percentageChange < 0) {
        completeData.percentageColorClass = 'text-rose-500'
        completeData.situation = 'menor';
      } else {
        completeData.situation = 'igual';
      }
    } else {
      completeData.comparative = 0;
      completeData.situation = 'sem comparação';
    }

    return completeData;
  }

  async getReservesOfMonth(user) {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Ajuste para o mês anterior
    if (lastMonth.getMonth() === 11) {
      // Se o mês for dezembro, ajuste para o ano anterior
      lastMonth.setFullYear(today.getFullYear() - 1);
    }


    const completeData = {
      'ammount': 0,
      'comparative': 0,
      'situation': '',
      'percentageColorClass': ''
    }

    const courts = await this.getUserCourts(user)

    let totalReservationsToday = 0;
    let totalReservationsLastMonth = 0

    for (const court of courts) {
      for (const reservation of court.Reservation) {
        const dateString = reservation.date;
        const [month, day, year] = dateString.split('-').map(Number);
        const dateReservation = new Date(year, month - 1, day);

        if (dateReservation.getMonth() === today.getMonth() && reservation.status === "Agendado") {
          totalReservationsToday++;
        }
        if (dateReservation.getMonth() === lastMonth.getMonth() && reservation.status === "Agendado") {
          totalReservationsLastMonth++;
        }
      }
    }

    completeData.ammount = totalReservationsToday;

    if (totalReservationsLastMonth > 0) {
      const percentageChange = ((totalReservationsToday - totalReservationsLastMonth) / totalReservationsLastMonth) * 100;
      completeData.comparative = Math.round(percentageChange * 10) / 10; // Arredonda para uma casa decimal

      if (percentageChange > 0) {
        completeData.situation = 'maior';
        completeData.percentageColorClass = 'text-emerald-500 dark:text-emerald-400'
      } else if (percentageChange < 0) {
        completeData.percentageColorClass = 'text-rose-500'
        completeData.situation = 'menor';
      } else {
        completeData.situation = 'igual';
      }
    } else {
      completeData.comparative = 0;
      completeData.situation = 'sem comparação';
    }

    return completeData;
  }


  async getCanceledsRevervesOfMonth(user) {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Ajuste para o mês anterior
    if (lastMonth.getMonth() === 11) {
      // Se o mês for dezembro, ajuste para o ano anterior
      lastMonth.setFullYear(today.getFullYear() - 1);
    }


    const completeData = {
      'ammount': 0,
      'comparative': 0,
      'situation': '',
      'percentageColorClass': ''
    }

    const courts = await this.getUserCourts(user)

    let totalCanceledsToday = 0;
    let totalCanceledsLastMonth = 0

    for (const court of courts) {
      for (const reservation of court.Reservation) {
        const dateString = reservation.date;
        const [month, day, year] = dateString.split('-').map(Number);
        const dateReservation = new Date(year, month - 1, day);

        if (dateReservation.getMonth() === today.getMonth() && reservation.status === "Cancelado") {
          totalCanceledsToday++
        }
        if (dateReservation.getMonth() === lastMonth.getMonth() && reservation.status === "Cancelado") {
          totalCanceledsLastMonth++
        }
      }
    }

    completeData.ammount = totalCanceledsToday;

    if (totalCanceledsLastMonth > 0) {
      const percentageChange = ((totalCanceledsToday - totalCanceledsLastMonth) / totalCanceledsLastMonth) * 100;
      completeData.comparative = Math.round(percentageChange * 10) / 10; // Arredonda para uma casa decimal

      if (percentageChange < 0) {
        completeData.situation = 'maior';
        completeData.percentageColorClass = 'text-emerald-500 dark:text-emerald-400'
      } else if (percentageChange > 0) {
        completeData.percentageColorClass = 'text-rose-500'
        completeData.situation = 'menor';
      } else {
        completeData.situation = 'igual';
      }
    } else {
      completeData.comparative = 0;
      completeData.situation = 'sem comparação';
    }

    return completeData;
  }

  async getTotalRevenueOfMonth(user) {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Ajuste para o mês anterior
    if (lastMonth.getMonth() === 11) {
      // Se o mês for dezembro, ajuste para o ano anterior
      lastMonth.setFullYear(today.getFullYear() - 1);
    }


    const completeData = {
      'ammount': 0,
      'comparative': 0,
      'situation': '',
      'percentageColorClass': ''
    }

    const courts = await this.getUserCourts(user)

    let totalRevenueToday = 0;
    let totalRevenueLastMonth = 0

    for (const court of courts) {
      for (const reservation of court.Reservation) {
        const dateString = reservation.date;
        const [month, day, year] = dateString.split('-').map(Number);
        const dateReservation = new Date(year, month - 1, day);

        if (dateReservation.getMonth() === today.getMonth() && reservation.status === "Agendado") {
          totalRevenueToday += Number(court.value);
        }
        if (dateReservation.getMonth() === lastMonth.getMonth() && reservation.status === "Agendado") {
          totalRevenueLastMonth += Number(court.value);
        }
      }
    }

    completeData.ammount = totalRevenueToday;

    if (totalRevenueLastMonth > 0) {
      const percentageChange = ((totalRevenueToday - totalRevenueLastMonth) / totalRevenueLastMonth) * 100;
      completeData.comparative = Math.round(percentageChange * 10) / 10; // Arredonda para uma casa decimal

      if (percentageChange > 0) {
        completeData.situation = 'maior';
        completeData.percentageColorClass = 'text-emerald-500 dark:text-emerald-400'
      } else if (percentageChange < 0) {
        completeData.percentageColorClass = 'text-rose-500'
        completeData.situation = 'menor';
      } else {
        completeData.situation = 'igual';
      }
    } else {
      completeData.comparative = 0;
      completeData.situation = 'sem comparação';
    }

    return completeData;
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

  async getRevenuePerDay(user) {
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
          count += Number(court.value)
        }
      }
      weekDates[dayNames[i]] = count;
    }

    return weekDates;
  }

  async get_C_ReservesPerMonth(user, year: string): Promise<{ [key: string]: number }> {
    const courts = await this.getUserCourts(user)
    const monthsOfYear = await this.getMonths()
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