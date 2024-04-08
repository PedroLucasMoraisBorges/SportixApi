import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { randomUUID } from 'crypto';
import { CreateCourtBody } from './dtos/create-court-body';
import { UserLogin } from 'src/user/entities/user.entity';
import { CreateOperatingDayBody } from './dtos/create-operatingDay-body';

@Injectable()
export class CourtService {

  constructor(private readonly prisma: PrismaService) { }
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
  async getUserCourts(user : UserLogin) {
    const courts = await this.prisma.court.findMany({
      where: {
        fk_user: user.id
      }
    })

    return courts
  }

  async createOperatingDays(object : CreateOperatingDayBody) {
    const { days, hours, fk_court } = object;
    const returnDays = []

    for(const dayInputed of days) {
      const existingDay = await this.prisma.operatingDay.findMany({
        where : {
          day: dayInputed,
          fk_court: fk_court
        }
      })

      if (existingDay.length == 0){
        const day = await this.prisma.operatingDay.create({
          data: {
            id : randomUUID(),
            day: dayInputed,
            court: {connect: {id: fk_court}}
          }
        })

        const returnHours = []

        for (const hourInputed of hours) {
          const existingHour = await this.prisma.time.findMany({
            where: {
              hour : hourInputed,
              fk_operating_day : day.id
            }
          }) 

          if (existingHour.length == 0) {
            const hour = await this.prisma.time.create({
              data: {
                id: randomUUID(),
                hour: hourInputed,
                operatingDay: {connect: {id: day.id}}
              }
            })

            returnHours.push(hour)
          }
        }
        returnDays.push({day, returnHours})
      }
    }

    return returnDays
  }
}
