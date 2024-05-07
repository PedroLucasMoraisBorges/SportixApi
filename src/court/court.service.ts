import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { randomUUID } from 'crypto';
import { CreateCourtBody } from './dtos/create-court-body';
import { UserLogin } from 'src/user/entities/user.entity';
import { CreateOperatingDayBody } from './dtos/create-operatingDay-body';
import { TimeForUSer } from './entities/time.entity';
import { ReserveTimeBody } from './dtos/reserve-time-body';
import { CancelReservationBody, CloseDayBody, CloseTimeBody } from './dtos/close-body';
import { SelectRecurrenceRangeBody } from './dtos/recurrence-user-body';
import { CourtUtilits } from './utilits/court.utilits';

@Injectable()
export class CourtService {

  constructor(private readonly prisma: PrismaService, private readonly courtUtilits: CourtUtilits) { }

  async create(object: CreateCourtBody, user) {

    const court = await this.prisma.court.create({
      data: {
        id: randomUUID(),
        name: object.name,
        road: object.road,
        neighborhood: object.neighborhood,
        city: object.city,
        number: object.number,
        reference: object.reference,
        user: { connect: { id: user.id } }
      }
    })

    return {
      court,
    }

  }

  async getUserCourts(user: UserLogin) {
    const courts = await this.prisma.court.findMany({
      where: {
        fk_user: user.id
      }
    })

    return courts
  }

  async getCourtInfo(id, date) {
    // Pega qual dia da semana é essa data
    const nomeDiaSemana = await this.courtUtilits.getWekendDay(date)

    const operatingDay = await this.prisma.operatingDay.findMany({
      where: {
        fk_court: id,
        day: nomeDiaSemana
      },
      include: { Times: true }
    })

    const returningTimes = []


    for (const time of operatingDay[0].Times) {
      const reservation = await this.prisma.reservation.findMany({
        where: {
          hour: time.hour,
          fk_court: id,
          date: date,
          status: "Agendado"
        }
      })

      const recurrenceUser = await this.prisma.recurrenceUser.findFirst({
        where: {
          fk_day: operatingDay[0].id,
          fk_time: time.id
        }
      })

      const freeGame = await this.prisma.freeGame.findMany({
        where: {
          hour: time.hour,
          fk_court: id,
          date: date
        }
      })


      const closure = await this.courtUtilits.closureFindMany(time.hour, id, date)

      const timeForUser: TimeForUSer = {
        id: time.id,
        hour: time.hour,
        status: "livre"
      }

      if (reservation.length != 0) {
        timeForUser.status = "Reservado"
      }
      else if (freeGame.length != 0) {
        timeForUser.status = "Jogo Livre"
      }
      else if (closure.length != 0) {
        timeForUser.status = "Fechado"
      }
      else if (recurrenceUser !== null) {
        const currentDate = this.courtUtilits.formateDateRequest(date)
        const start_date = this.courtUtilits.formateDateRequest(recurrenceUser.start_date)

        const dates = await this.courtUtilits.getDates(start_date, recurrenceUser.range_days, currentDate);

        dates.forEach(date => {
          const formattedDate = this.courtUtilits.formatDate(date); // Formata a data antes de exibir
          if (formattedDate === currentDate) {
            timeForUser.status = "Reservado"
          }
        });
      }
      else {
        timeForUser.status = "Livre"
      }


      returningTimes.push(timeForUser)
    }

    return returningTimes
  }

  async createOperatingDays(object: CreateOperatingDayBody) {
    const { days, hours, fk_court } = object;
    const returnDays = []

    for (const dayInputed of days) {
      const existingDay = await this.prisma.operatingDay.findMany({
        where: {
          day: dayInputed,
          fk_court: fk_court
        }
      })

      if (existingDay.length == 0) {
        const day = await this.prisma.operatingDay.create({
          data: {
            id: randomUUID(),
            day: dayInputed,
            court: { connect: { id: fk_court } }
          }
        })

        const returnHours = []

        for (const hourInputed of hours) {
          const existingHour = await this.prisma.time.findMany({
            where: {
              hour: hourInputed,
              fk_operating_day: day.id
            }
          })

          if (existingHour.length == 0) {
            const hour = await this.prisma.time.create({
              data: {
                id: randomUUID(),
                hour: hourInputed,
                operatingDay: { connect: { id: day.id } }
              }
            })

            returnHours.push(hour)
          }
        }
        returnDays.push({ day, returnHours })
      }
    }

    return returnDays
  }

  async reserveTime(reserveTimeBody: ReserveTimeBody, client) {
    const { fk_court, date, hour } = reserveTimeBody

    const reservation = await this.prisma.reservation.create({
      data: {
        id: randomUUID(),
        court: { connect: { id: fk_court } },
        hour: hour,
        date: date,
        status: "Agendado",
        client: { connect: { id: client.id } }
      }
    })

    return reservation
  }

  async getCourts(ownerId) {
    const courts = await this.prisma.court.findMany({
      where: {
        fk_user: ownerId
      }
    })

    return courts
  }

  async getReservedTimes(user) {
    const courts = await this.prisma.court.findMany({
      where: {
        fk_user: user.id
      },
      include: {
        Reservation: true
      }
    });

    const listReservations = [];

    const promises = courts.map(async court => {
      const reservations = await this.prisma.reservation.findMany({
        where: {
          fk_court: court.id
        }
      });
      listReservations.push(...reservations);
    });

    await Promise.all(promises);

    return listReservations;
  }

  async closeTime(closeTimeBody: CloseTimeBody) {
    const { fk_court, date, hour } = closeTimeBody

    const isClosure = await this.prisma.closure.findMany({
      where: {
        fk_court: fk_court,
        date: date,
        hour: hour
      }
    })

    if (isClosure.length != 0) {
      throw new Error("O horário desse dia já está fechado")
    }

    const closure = await this.prisma.closure.create({
      data: {
        id: randomUUID(),
        date: date,
        hour: hour,
        court: { connect: { id: fk_court } },
      }
    })

    return closure
  }

  async releaseTime(releaseTimeBody: ReserveTimeBody) {
    const { fk_court, date, hour } = releaseTimeBody

    const isFreeGame = await this.prisma.freeGame.findMany({
      where: {
        fk_court: fk_court,
        date: date,
        hour: hour
      }
    })

    if (isFreeGame.length != 0) {
      throw new Error("O horário desse dia já está aberto")
    }

    const freeGame = await this.prisma.freeGame.create({
      data: {
        id: randomUUID(),
        date: date,
        hour: hour,
        court: { connect: { id: fk_court } },
      }
    })

    return freeGame
  }

  async closeDay(closeDayBody: CloseDayBody) {
    const { fk_court, date } = closeDayBody

    const nomeDiaSemana = await this.courtUtilits.getWekendDay(date)

    const operatingDay = await this.prisma.operatingDay.findMany({
      where: {
        fk_court: fk_court,
        day: nomeDiaSemana
      },
      include: { Times: true }
    })

    const response = []

    for (const time of operatingDay[0].Times) {
      const haveReservation = await this.prisma.reservation.findMany({
        where: {
          fk_court: fk_court,
          hour: time.hour,
          date: date
        }
      })

      if (haveReservation.length == 0) {
        const haveClosure = await this.courtUtilits.closureFindMany(time.hour, fk_court, date)

        if (haveClosure.length == 0) {
          const closure = await this.prisma.closure.create({
            data: {
              id: randomUUID(),
              date: date,
              hour: time.hour,
              court: { connect: { id: fk_court } },
            }
          })

          response.push(closure)
        }
        else {
          response.push('O horário ' + time.hour + ' já está fechado')
        }
      }
      else {
        response.push('O horário ' + time.hour + ' está reservado, trate com o cliente sobre isso')
      }
    }

    return response
  }

  async getUserReservations(client) {
    const reservation = await this.prisma.reservation.findMany({
      where: {
        fk_user: client.id
      }
    })

    return reservation
  }

  async cancelReservation(cancelReservationBody: CancelReservationBody) {
    const { idReservation } = cancelReservationBody
    const cancelReservation = await this.prisma.reservation.update({
      where: {
        id: idReservation
      },
      data: {
        status: "Cancelado"
      }
    });

    return cancelReservation
  }

  async turnRecurrentUser(selectRecurrenceRangeBody: SelectRecurrenceRangeBody, user) {
    const { fk_court, hour, day, range_days } = selectRecurrenceRangeBody

    const operatingDay = await this.prisma.operatingDay.findFirst({
      where: {
        fk_court: fk_court,
        day: day
      }
    })

    const time = await this.prisma.time.findFirst({
      where: {
        fk_operating_day: operatingDay.id,
        hour: hour
      }
    })

    const recurrenceUser = await this.prisma.recurrenceUser.create({
      data: {
        id: randomUUID(),
        range_days: range_days,
        court: { connect: { id: fk_court } },
        time: { connect: { id: time.id } },
        day: { connect: { id: operatingDay.id } },
        user: { connect: { id: user.id } }
      }
    })

    return recurrenceUser
  }
}