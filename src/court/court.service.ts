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
import { ReleaseTimebody } from './dtos/release-time-body';

@Injectable()
export class CourtService {

  constructor(private readonly prisma: PrismaService, private readonly courtUtilits: CourtUtilits) { }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // Criação e Manuntenção Quadras
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

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

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // Requisição das quadras
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  async getUserCourts(user: UserLogin) {
    const courts = await this.prisma.court.findMany({
      where: {
        fk_user: user.id
      }
    })

    return courts
  }

  async getCourtInfo(fk_court, date) {
    const nomeDiaSemana = await this.courtUtilits.getWekendDay(date)

    const operatingDay = await this.prisma.operatingDay.findMany({
      where: {
        fk_court: fk_court,
        day: nomeDiaSemana
      },
      include: { Times: true }
    })

    const returningTimes = []

    for (const time of operatingDay[0].Times) {
      const haveReservation = await this.courtUtilits.reservationFindMany(fk_court, date, time.hour, "Agendado")
      const haveFreeGame = await this.courtUtilits.freeGameFindMany(fk_court, date, time.hour)
      const haveClosure = await this.courtUtilits.closureFindMany(time.hour, fk_court, date)

      const recurrenceUser = await this.prisma.recurrenceUser.findFirst({
        where: {
          fk_day: operatingDay[0].id,
          fk_time: time.id
        }
      })

      const timeForUser: TimeForUSer = {
        id: time.id,
        hour: time.hour,
        status: "livre"
      }

      if (haveReservation.length == 0 && haveFreeGame.length == 0 && haveClosure.length == 0) {
        if (recurrenceUser !== null) {
          const haveRecurrenceUser = await this.courtUtilits.validateRecurrenceUser(date, recurrenceUser);
          if (!haveRecurrenceUser) {
            returningTimes.push(timeForUser)
          }
        }
      }

      returningTimes.push(timeForUser)
    }

    return returningTimes
  }

  async getUserCourtInfo(fk_court, date) {
    const nomeDiaSemana = await this.courtUtilits.getWekendDay(date)

    const operatingDay = await this.prisma.operatingDay.findMany({
      where: {
        fk_court: fk_court,
        day: nomeDiaSemana
      },
      include: { Times: true }
    })

    const returningTimes = []

    for (const time of operatingDay[0].Times) {
      const haveReservation = await this.courtUtilits.reservationFindMany(fk_court, date, time.hour, "Agendado")
      const haveFreeGame = await this.courtUtilits.freeGameFindMany(fk_court, date, time.hour)
      const haveClosure = await this.courtUtilits.closureFindMany(time.hour, fk_court, date)

      const recurrenceUser = await this.prisma.recurrenceUser.findFirst({
        where: {
          fk_day: operatingDay[0].id,
          fk_time: time.id
        }
      })

      const timeForUser: TimeForUSer = {
        id: time.id,
        hour: time.hour,
        status: "livre"
      }

      if (haveReservation.length != 0) {
        timeForUser.status = "Reservado"
      }
      else if (haveFreeGame.length != 0) {
        timeForUser.status = "Jogo Livre"
      }
      else if (haveClosure.length != 0) {
        timeForUser.status = "Fechado"
      }
      else if (recurrenceUser !== null) {
        const haveRecurrenceUser = await this.courtUtilits.validateRecurrenceUser(date, recurrenceUser);

        if (haveRecurrenceUser) {
          timeForUser.status = "Reservado";
        }
      }
      else {
        timeForUser.status = "Livre"
      }

      returningTimes.push(timeForUser)
    }

    return returningTimes
  }

  async getCourts(ownerId) {
    const courts = await this.prisma.court.findMany({
      where: {
        fk_user: ownerId
      }
    })

    return courts
  }

  async getUserReservations(client) {
    const reservation = await this.prisma.reservation.findMany({
      where: {
        fk_user: client.id
      }
    })

    return reservation
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

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // Reserva de horários
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  async reserveTime(reserveTimeBody: ReserveTimeBody, client) {
    const { fk_court, date, hours } = reserveTimeBody
    const returnReservation = []

    for (const hour of hours) {
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

      returnReservation.push(reservation)
    }

    return returnReservation
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

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // Fechar Horários
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  async closeTime(closeTimeBody: CloseTimeBody) {
    const { fk_court, date, hours } = closeTimeBody
    const returnClosures = []

    for (const hour of hours) {
      const haveClosure = await this.courtUtilits.closureFindMany(fk_court, date, hour)
      const haveReservation = await this.courtUtilits.reservationFindMany(fk_court, date, hour, "Agendado")

      if (haveClosure.length != 0) {
        throw new Error("O horário desse dia já está fechado")
      }
      if (haveReservation.length != 0) {
        // Enviar email para o cliente sobre o cancelamento da sua reserva
      }

      const closure = await this.prisma.closure.create({
        data: {
          id: randomUUID(),
          date: date,
          hour: hour,
          court: { connect: { id: fk_court } },
        }
      })

      returnClosures.push(closure)
    }

    return returnClosures
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
      const haveReservation = await this.courtUtilits.reservationFindMany(fk_court, date, time.hour, "Agendado")

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

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // Ofertar Dias Livres
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  async releaseTime(releaseTimeBody: ReleaseTimebody) {
    const { fk_court, date, hour } = releaseTimeBody

    const haveFreeGame = await this.courtUtilits.freeGameFindMany(fk_court, date, hour)

    if (haveFreeGame.length != 0) {
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

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // Usuário Recorrente
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

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